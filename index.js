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

const loadCategories = () => {
    fetch("https://fakestoreapi.com/products/categories")
        .then(res => res.json())
        .then(data => displayCategories(data))
        .catch(err => console.log(err));
};

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

const loadProducts = (isLimit) => {
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => {
            const products = isLimit ? data.slice(0, 3) : data;
            displayProducts(products);
        });
};

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
            const existingModal = document.getElementById("dt_modal_container");
            if (existingModal) existingModal.remove();

            const modalContainer = document.createElement("div");
            modalContainer.id = "dt_modal_container";
            modalContainer.innerHTML = `
                <dialog id="dt_modal" class="modal modal-bottom sm:modal-middle">
                  <div class="modal-box max-w-lg p-0 overflow-hidden bg-white rounded-xl shadow-2xl border border-gray-100">
                    <div class="flex flex-col md:flex-row">
                        <div class="md:w-5/12 bg-gray-50 p-6 flex items-center justify-center">
                            <img src="${product.image}" class="max-h-48 object-contain">
                        </div>
                        
                        <div class="md:w-7/12 p-6 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">${product.category}</span>
                                    <form method="dialog">
                                        <button class="text-gray-400 hover:text-gray-600 transition-colors">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </form>
                                </div>
                                <h3 class="font-bold text-lg text-gray-800 mb-2 leading-tight line-clamp-2">${product.title}</h3>
                                
                                <p class="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                    ${product.description}
                                </p>
                            </div>
                            
                            <div class="flex items-center justify-between mt-4">
                                <div>
                                    <span class="text-gray-400 text-[10px] block mb-1 font-medium">Price</span>
                                    <p class="text-2xl font-bold text-gray-900">$${product.price}</p>
                                </div>
                                <button onclick="addToCart()" class="btn btn-primary btn-md px-6 rounded-lg font-bold shadow-md shadow-blue-100">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                  </div>
                  <form method="dialog" class="modal-backdrop bg-transparent">
                    <button>close</button>
                  </form>
                </dialog>`;
            
            document.body.appendChild(modalContainer);
            const modal = document.getElementById("dt_modal");
            modal.showModal();
        });
};

init();