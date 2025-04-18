export const validateProduct = (product) => {
    return product?.product?.id && product?.photo
  }
  
  export const mapProducts = async (products, storage) => {
    return Promise.all(
      products.map(async (product) => {
        const photoRef = ref(storage, `surveys/${Date.now()}_${product.product.id}.jpg`)
        await uploadString(photoRef, product.photo, 'data_url')
        return {
          ...product.product,
          photoUrl: await getDownloadURL(photoRef)
        }
      })
    )
  }
  