console.log("Users frontend javascript file");
$(function () {
  $(".member-status").on("change", function (e) {
    const id = e.target.id;

    const memberStatus = $(`#${id}.member-status`).val();

    //TODO AXIOS updateChosenUser
    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        console.log("response", response.data);
        const result = response.data;
        if (result) {
          console.log("User updated!", result);
          $(".member-status").blur();
          alert("User updated!");
        } else {
          console.log(err);
          alert("User update failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("User update failed!");
      });
  });
});
