let cartCount = 0;

// ১. ডাটা লোড করার মেইন ফাংশন
const init = () => {
    const categoryContainer = document.getElementById("category-container");
    const productContainer = document.getElementById("product-container");

    if (categoryContainer) {
        // যদি ক্যাটাগরি কন্টেইনার থাকে, তবে এটি প্রোডাক্ট পেজ
        loadCategories();
        loadProducts(false); // সব প্রোডাক্ট দেখাবে
    } else if (productContainer) {
        // যদি শুধু প্রোডাক্ট কন্টেইনার থাকে (যেমন হোম পেজ), তবে ৩টি দেখাবে
        loadProducts(true);
    }
};

// ২. ক্যাটাগরি নিয়ে আসা
const loadCategories = () => {
    fetch("https://fakestoreapi.com/products/categories")
        .then(res => res.json())
        .then(data => displayCategories(data))
        .catch(err => console.log(err));
};

// ৩. ক্যাটাগরি বাটন দেখানো
const displayCategories = (categories) => {
    const container = document.getElementById("category-container");
    container.innerHTML = "";

    const createBtn = (name, isActive = false) => {
        const btn = document.createElement("button");
        btn.classList = `btn ${isActive ? 'btn-primary text-white' : 'btn-outline btn-primary'} px-6 rounded-full font-bold capitalize`;
        btn.innerText = name;
        return btn;
    };

    // All Button
    const allBtn = createBtn("All", true);
    allBtn.onclick = (e) => {
        handleActiveBtn(e);
        loadProducts(false);
    };
    container.appendChild(allBtn);

    // Other Buttons
    categories.forEach(cat => {
        const btn = createBtn(cat);
        btn.onclick = (e) => {
            handleActiveBtn(e);
            fetch(`https://fakestoreapi.com/products/category/${cat}`)
                .then(res => res.json())
                .then(data => displayProducts(data));
        };
        container.appendChild(btn);
    });
};

const handleActiveBtn = (e) => {
    const allBtns = document.querySelectorAll("#category-container button");
    allBtns.forEach(btn => {
        btn.classList.remove("btn-primary", "text-white");
        btn.classList.add("btn-outline");
    });
    e.target.classList.add("btn-primary", "text-white");
    e.target.classList.remove("btn-outline");
};

// ৪. প্রোডাক্ট নিয়ে আসা
const loadProducts = (isLimit) => {
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => {
            const products = isLimit ? data.slice(0, 3) : data;
            displayProducts(products);
        });
};

// ৫. প্রোডাক্ট কার্ড দেখানো
const displayProducts = (products) => {
    const container = document.getElementById("product-container");
    container.innerHTML = "";
    
    products.forEach(product => {
        const div = document.createElement("div");
        div.classList = "card bg-base-100 shadow-xl border border-gray-100 hover:scale-105 transition-transform duration-300";
        div.innerHTML = `
            <figure class="px-4 pt-4 h-52 bg-white"><img src="${product.image}" class="h-full object-contain" /></figure>
            <div class="card-body">
                <h2 class="card-title text-sm font-bold line-clamp-1">${product.title}</h2>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-blue-600">$${product.price}</span>
                    <div class="badge badge-outline text-[10px]">${product.category}</div>
                </div>
                <div class="card-actions justify-between mt-4">
                    <button onclick="showDetails('${product.id}')" class="btn btn-ghost btn-sm border-blue-600 text-blue-600">Details</button>
                    <button onclick="addToCart()" class="btn btn-primary btn-sm">Buy Now</button>
                </div>
            </div>`;
        container.appendChild(div);
    });
};

const addToCart = () => {
    cartCount++;
    document.getElementById("cart-count").innerText = cartCount;
};

const showDetails = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(product => {
            const modal = document.createElement("div");
            modal.innerHTML = `
                <dialog id="dt_modal" class="modal modal-middle">
                  <div class="modal-box">
                    <img src="${product.image}" class="w-32 mx-auto mb-4">
                    <h3 class="font-bold text-lg">${product.title}</h3>
                    <p class="py-4 text-sm">${product.description}</p>
                    <div class="modal-action"><form method="dialog"><button class="btn btn-error btn-sm text-white">Close</button></form></div>
                  </div>
                </dialog>`;
            document.body.appendChild(modal);
            document.getElementById("dt_modal").showModal();
        });
};

init();