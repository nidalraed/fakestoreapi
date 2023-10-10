
function Product(title, price, description, image) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
}


const products = [];


async function fetchDataAndCreateObjects() {
    try {
        const response = await fetch('https://fakestoreapi.com/products'); 
        if (!response.ok) {
            throw new Error('Failed to fetch data from the API.');
        }
        const data = await response.json();
        

        for (let i = 0; i < 20; i++) {
            const { title, price, description, image } = data[i]; 
            const product = new Product(title, price, description, image);
            products.push(product);
        }

 
        renderProducts();
    } catch (error) {
        console.error(error);
    }
}


function renderProducts() {
    const mainElement = document.querySelector('main');
    

    const productCards = products.map((product, index) => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>${product.price}</p>
            <p>${product.description}</p>
        </div>
    `);
    

    mainElement.innerHTML = productCards.join('');
}


fetchDataAndCreateObjects();







//SECTION 2
document.addEventListener("DOMContentLoaded", () => {
    const addProductForm = document.getElementById("add-product-form");
    const productList = document.getElementById("product-list");

    function fetchAndDisplayProducts() {
        fetch("http://localhost:3000/products")
            .then((response) => response.json())
            .then((data) => {
                productList.innerHTML = "";
                data.forEach((product) => {
                    displayProduct(product);
                });
            });
    }

    function displayProduct(product) {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <p>${product.description}</p>
            <div class="card-buttons">
                <button class="delete-product" data-id="${product.id}">Delete</button>
                <button class="update-product" data-id="${product.id}">Update</button>
            </div>
        `;
        productList.appendChild(productCard);

        const updateButton = productCard.querySelector(".update-product");
        updateButton.addEventListener("click", () => {
            const productId = updateButton.getAttribute("data-id");
            const updatedTitle = prompt("Enter updated title:", product.title);
            const updatedPrice = parseFloat(prompt("Enter updated price:", product.price));
            const updatedDescription = prompt("Enter updated description:", product.description);

            fetch(`http://localhost:3000/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    price: updatedPrice,
                    description: updatedDescription,
                }),
            })
                .then((response) => response.json())
                .then((updatedProduct) => {
                    const updatedProductCard = productCard;
                    updatedProductCard.querySelector("h3").textContent = updatedProduct.title;
                    updatedProductCard.querySelector("p:nth-child(2)").textContent = `Price: $${updatedProduct.price}`;
                    updatedProductCard.querySelector("p:nth-child(3)").textContent = updatedProduct.description;
                })
                .catch((error) => console.error("Error updating product:", error));
        });
    }

    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("product-title").value;
        const price = parseFloat(document.getElementById("product-price").value);
        const description = document.getElementById("product-description").value;

        fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, price, description }),
        })
            .then((response) => response.json())
            .then((newProduct) => {
                displayProduct(newProduct);
                addProductForm.reset();
            })
            .catch((error) => console.error("Error adding product:", error));
    });

    productList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-product")) {
            const productId = e.target.getAttribute("data-id");
            fetch(`http://localhost:3000/products/${productId}`, {
                method: "DELETE",
            })
                .then(() => {
                    e.target.parentElement.parentElement.remove();
                })
                .catch((error) => console.error("Error deleting product:", error));
        }
    });

    fetchAndDisplayProducts();
});

