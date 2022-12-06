const deleteOneProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const crsf = btn.parentNode.querySelector("[name=_csrf]").value;
  const itemElement = btn.closest("article");

  fetch(`/admin/product/${productId}`, {
    method: "delete",
    headers: { "csrf-token": crsf },
  })
    // .then((response) => {
    //   return response.json();
    // })
    .then(() => {
      itemElement.parentNode.removeChild(itemElement);
    })
    .catch((err) => console.log(err));
};
