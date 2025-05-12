document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            toggleEditForm(productId);
        });
    });
});

function toggleEditForm(productId) {
    const productRow = document.getElementById(`product-${productId}`);
    const productDetails = productRow.querySelector(".product-details");
    const editForm = document.getElementById(`edit-form-${productId}`);

    if (editForm.classList.contains("hidden")) {
        productDetails.classList.add("hidden");
        editForm.classList.remove("hidden");
    } else {
        productDetails.classList.remove("hidden");
        editForm.classList.add("hidden");
    }
}