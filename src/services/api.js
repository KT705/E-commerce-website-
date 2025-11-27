const url = "https://fakestoreapi.com/products";

export const getLatestProducts = async () => {
    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json()
    return data
};

export const getProductById = async (id) => {
    const response = await fetch(`${url}/${id}`);

    if(!response.ok){
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data
};