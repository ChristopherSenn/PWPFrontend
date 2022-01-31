// Sorts array with user objects in alphabetical order
export function sortDropdown(listToSort) {
    listToSort.sort((userA, userB) => {
        if(userA.username.toUpperCase() < userB.username.toUpperCase()){ 
          return -1; 
        }
        if(userA.username.toUpperCase() > userB.username.toUpperCase()){ 
          return 1; 
        }
        return 0;
    })
    return listToSort;
}


