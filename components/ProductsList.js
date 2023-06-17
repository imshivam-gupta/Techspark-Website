import 


const ProductsList = () => {

    return ()
    <div className='w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-4 gap-x-10 mt-10 mb-5'>
        {props.products.map(product => (
        <div key={product._id} className='flex'>
            <Product product={product} />
        </div>
        ))}
    </div>
    )
    }