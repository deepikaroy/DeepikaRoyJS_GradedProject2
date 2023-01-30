localStorage.setItem('currentIndex', '0');

const jsondata = await
import ('/data.json', {
    assert: { type: 'json' }
});

const data = jsondata.default.data;


let currentIndex = 0;
let totalCandidateRecordsInJSON = data.length;
let searchResults = [];

let mainhtml = document.querySelector('main').innerHTML;
loadInitialPage();


//Search box event handler
let searchBoxElement = document.querySelector('#searchBox input');
searchBoxElement.addEventListener('keypress', (event) => {


    if (event.keyCode === 13 || event.key === "Enter") {

        searchResults = getSearchedResults(searchBoxElement.value, data);
        if (searchResults.length > 0) {
            document.querySelector('main').innerHTML = mainhtml;
            updateResumePage(searchResults, currentIndex, searchResults.length);
        }
        handlePageNavigation(currentIndex, searchResults.length);

    }
});

//Next Button click event handler
document.getElementById("next").addEventListener('click', function() {

    let resultCount = searchResults.length > 0 ? searchResults.length : totalCandidateRecordsInJSON;
    let records = searchResults.length > 0 ? searchResults : data;
    currentIndex = getIndexFromLocalStorage('currentIndex');

    currentIndex++;

    localStorage.setItem('currentIndex', currentIndex);
    handlePageNavigation(currentIndex, resultCount);
    updateResumePage(records, currentIndex, resultCount);
});

//Previous Button click event handler
document.getElementById("previous").addEventListener('click', function() {

    let resultCount = searchResults.length > 0 ? searchResults.length : totalCandidateRecordsInJSON;
    let records = searchResults.length > 0 ? searchResults : data;
    currentIndex = getIndexFromLocalStorage('currentIndex');

    currentIndex--;

    localStorage.setItem('currentIndex', currentIndex);
    handlePageNavigation(currentIndex, resultCount);
    updateResumePage(records, currentIndex, resultCount);

});


function loadInitialPage() {
    currentIndex = getIndexFromLocalStorage('currentIndex');
    updateResumePage(data, currentIndex, totalCandidateRecordsInJSON);
    handlePageNavigation(currentIndex, totalCandidateRecordsInJSON);
}

function getSearchedResults(searchText, candidateArray) {
    let candidatesInSearch = [];
    if (searchText.trim().length > 0) {

        for (let i = 0; i < totalCandidateRecordsInJSON; i++) {
            const jobOpeningName = candidateArray[i].basics.AppliedFor;

            if (jobOpeningName.toLowerCase().includes(searchText.toLowerCase()) || searchText.toLowerCase().includes(jobOpeningName.toLowerCase())) {
                candidatesInSearch.push(candidateArray[i]);
            }
        }

        if (candidatesInSearch.length === 0) {
            document.querySelector('#previous').setAttribute('hidden', 'hidden');
            document.querySelector('#next').setAttribute('hidden', 'hidden');


            let errorPage = `
            <div style="display: flex; flex-direction: row;justify-content: space-evenly;margin-top: 20%;margin-left: auto;margin-right: auto;align-items: center;padding: 15px 15px;width: 550px;height: 150px;border: 1px solid black;box-shadow: 0px 0px 15px 3px #000000;">
                <img style="height: 100px; width: 100px" src="./images/images.png" alt="black frowning face">
                <p style="font-size: 30px">No such results found</p>
            </div>
            `;
            document.querySelector('main').innerHTML = errorPage;
        }
    } else {
        candidatesInSearch = data;
    }

    return candidatesInSearch;
}

function handlePageNavigation(currentIndex, totalCandidatesFoundInSearch) {

    if (totalCandidatesFoundInSearch === 0 || totalCandidatesFoundInSearch === 1) {
        document.querySelector('#previous').setAttribute('hidden', 'hidden');
        document.querySelector('#next').setAttribute('hidden', 'hidden');
    } else if (totalCandidatesFoundInSearch > 1) {
        if (currentIndex === 0) {
            document.querySelector('#next').removeAttribute('hidden');
            document.querySelector('#previous').setAttribute('hidden', 'hidden');
        } else if (currentIndex == totalCandidatesFoundInSearch - 1) {
            document.querySelector('#previous').removeAttribute('hidden');
            document.querySelector('#next').setAttribute('hidden', 'hidden');
        } else {
            document.querySelector('#previous').removeAttribute('hidden');
            document.querySelector('#next').removeAttribute('hidden');
        }
    }

}

function getIndexFromLocalStorage(key) {
    return currentIndex = parseInt(localStorage.getItem(key));
}

function updateResumePage(data, index, recordsCount) {
    const item = data[index];
    updateCandidateDetails(item);
    handlePageNavigation(index, recordsCount);
}

function updateCandidateDetails(item) {
    updateBasicsSection(item);
    updateWorkSection(item);
    updateProjectSection(item);
    updateEducationSection(item);
    updateInternshipSection(item);
    updateAchievementsSection(item);
}

function updateBasicsSection(item) {
    //update name, applied for and networking
    const { basics: { name, AppliedFor, image, email, phone, profiles: {...networking } } } = item;
    document.querySelector('#headerBox h2').innerHTML = name;
    document.querySelector('#headerBox p').innerHTML = "Applied For: " + AppliedFor;

    let networkingLink = `<a href="${networking.url}">${networking.network}</a>`;
    document.querySelector('#personalDetailsBox p').innerHTML = `<p>${phone}</p><p>${email}</p><p>${networkingLink}</p>`;

    //update hobbies
    const { interests: { hobbies: [...hobbys] } } = item;
    document.querySelector('#hobby').innerHTML = pTagBuilderFromArray(hobbys);

    //update technical skills
    const { skills: { keywords: [...skill] } } = item;
    document.querySelector('#skill').innerHTML = pTagBuilderFromArray(skill);

}

function updateWorkSection(item) {
    //update work details
    const { work: {...workvalueobject } } = item;
    const mapOfWork = new Map(Object.entries(workvalueobject));
    let experience = "";
    for (let [workKey, workValue] of mapOfWork) {
        let tempLabel = `<span style="font-weight: bold; text-transform: capitalize">${workKey} :</span>`;
        experience += "<p>" + tempLabel + " " + workValue + "</p>";
    }
    document.querySelector('#previousWork').innerHTML = experience;
}

function updateProjectSection(item) {
    const { projects: { name, description } } = item;
    let nameOfProject = `<span style="font-weight: bold; text-transform: capitalize">${name} :</span>`;
    document.querySelector('#project').innerHTML = "<p>" + nameOfProject + " " + description + "</p>";
}

function updateEducationSection(item) {
    const { education: {...eduDetails } } = item;
    const mapOfEducation = new Map(Object.entries(eduDetails));
    let educationInfo = "";
    for (let [edKey, edValue] of mapOfEducation) {
        let edLevel = `<span style="font-weight: bold; text-transform: capitalize">${edKey} :</span>`;
        educationInfo += "<p>" + edLevel + " " + Object.values(edValue) + "</p>";
    }
    document.querySelector('#education').innerHTML = educationInfo;
}

function updateInternshipSection(item) {
    const { Internship: {...internshipObject } } = item;
    const mapOfIntership = new Map(Object.entries(internshipObject));
    let internshipString = "";
    for (let [internKey, internValue] of mapOfIntership) {
        let internLabel = `<span style="font-weight: bold; text-transform: capitalize">${internKey} :</span>`;
        internshipString += "<p>" + internLabel + " " + internValue + "</p>";
    }
    document.querySelector('#internship').innerHTML = internshipString;
}

function updateAchievementsSection(item) {
    const { achievements: { Summary: [...achivementObject] } } = item;
    document.querySelector('#achievements').innerHTML = pTagBuilderFromArray(achivementObject);
}

function pTagBuilderFromArray(object) {
    let stringValue = "";
    for (let arrElement of object) {
        stringValue += "<p>" + arrElement + "</p>";
    }
    return stringValue;
}