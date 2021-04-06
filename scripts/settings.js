writeUserEmail('#user-email')
writeUserName('#user-name')

writeMaxOccupancy('#occupancy')
writeStoreName('#store-name')

document.getElementById('confirm-logout-btn').addEventListener("click", function(event){
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.assign("index.html");
      }).catch((error) => {
        console.log(error)
      });
})