import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState,useEffect } from "react";
import { toast } from "react-toastify";
import XCircleIcon from "@heroicons/react/24/outline/XCircleIcon";
import Product from "../components/Product";
import { Button, IconButton, Select, Option } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchProductData } from "../store/products-actions";


const prices = [
  {
    name: "Rs 100  - Rs 1500",
    value: "0-1500",
  },
  {
    name: "Rs 1500 - Rs 5000",
    value: "1500-5000",
  },
  {
    name: "Rs 5000 - Rs 200000",
    value: "5000-200000",
  },
];

const ratings = [1, 2, 3, 4, 5];


export default function Search() {

  const router = useRouter();
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.products);
  const { products, loading } = productState;

  const distinctCategory = [...new Set(products.map((product) => product.category))];
  const distinctBrand = [...new Set(products.map((product) => product.brand))];

  useEffect(() => {
    if(products.length === 0) dispatch(fetchProductData());
  }, [dispatch]);

  const { 
    query = "all", 
    category = "all", 
    brand = "all", 
    price = "all", 
    rating = "all", 
    sort = "featured",
    page = 1
  } = router.query;


  const [active, setActive] = useState(page);
  const [activeCateg, setActiveCateg] = useState(category);
  const [activeBrand, setActiveBrand] = useState(brand);
  const [activeSort, setActiveSort] = useState(sort);
  const [activeRating, setActiveRating] = useState(rating);
  const [activePrice, setActivePrice] = useState(price);


  let productlist = products
  .filter((product) => product.brand === activeBrand || activeBrand === "all")
  .filter((product) => product.category === activeCateg || activeCateg === "all")
  .filter((product) => product.rating >= activeRating || activeRating === "all")
  .filter((product) => product.price >= activePrice.split("-")[0] && product.price <= activePrice.split("-")[1] || activePrice === "all")
  .filter((product) => {
    const regex = new RegExp(`.*${query}.*`, "i");
    return regex.test(product.name) || query==="all"
  })
  .sort((a, b) => {
    if (sort === "featured") {
      return a.isFeatured === true ? -1 : 1;
    } else if (sort === "lowest") {
      return a.price - b.price;
    } else if (sort === "highest") {
      return b.price - a.price;
    } else if (sort === "toprated") {
      return b.rating - a.rating;
    } else if (sort === "newest") {
      return b.createdAt - a.createdAt;
    } else {
      return b.createdAt - a.createdAt;
    }
  })
  .slice((active - 1) * 9, active * 9)



  useEffect(() => {
    // console.log(router.query)
    if (router.query.page) setActive(router.query.page); else setActive(1);
    if (router.query.category) setActiveCateg(router.query.category); else setActiveCateg("all");
    if (router.query.brand) setActiveBrand(router.query.brand); else setActiveBrand("all");
    if (router.query.sort) setActiveSort(router.query.sort); else setActiveSort("featured");
    if (router.query.rating) setActiveRating(router.query.rating);  else setActiveRating("all");
    if (router.query.price) setActivePrice(router.query.price); else setActivePrice("all");

    productlist = products
    .filter((product) => product.brand === activeBrand || activeBrand === "all")
    .filter((product) => product.category === activeCateg || activeCateg === "all")
    .filter((product) => product.rating >= activeRating || activeRating === "all")
    .filter((product) => product.price >= activePrice.split("-")[0] && product.price <= activePrice.split("-")[1] || activePrice === "all")
    .filter((product) => {
      const regex = new RegExp(`.*${query}.*`, "i");
      return regex.test(product.name) || query==="all"
    })
    .sort((a, b) => {
      if (sort === "featured") {
        return a.isFeatured === true ? -1 : 1;
      } else if (sort === "lowest") {
        return a.price - b.price;
      } else if (sort === "highest") {
        return b.price - a.price;
      } else if (sort === "toprated") {
        return b.rating - a.rating;
      } else if (sort === "newest") {
        return b.createdAt - a.createdAt;
      } else {
        return b.createdAt - a.createdAt;
      }
    })
    .slice((active - 1) * 9, active * 9)


  }, [router.query]);



  const filterSearch = ({ page, category, brand, sort, min, max, searchQuery, price, rating,}) => {
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: router.pathname,
      query: query,
    });

  };

 
  const pages = Math.ceil(products.length / 9);

  const categoryHandler = (e) => {
    setActiveCateg(e);
    setActive(1);
    filterSearch({ category: e });
  };

  const pageHandler = (page) => {
    if (page > pages || page < 1) return;
    filterSearch({ page });
    setActive(1);
    setActive(page);
  };

  const brandHandler = (e) => {
    setActiveBrand(e);
    setActive(1);
    filterSearch({ brand: e });
  };

  const sortHandler = (e) => {
    setActiveSort(e);
    setActive(1);
    filterSearch({ sort: e });
  };

  const priceHandler = (e) => {
    setActivePrice(e);
    setActive(1);
    filterSearch({ price: e });
  };

  const ratingHandler = (e) => {
    setActiveRating(e);
    setActive(1);
    filterSearch({ rating: e });
  };

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: active === index ? "blue" : "blue-gray",
    onClick: () => setActive(index),
  });

  const next = () => {
    if (active === pages) return;
    filterSearch({ page: active + 1 });
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    filterSearch({ page: active - 1 });
    setActive(active - 1);
  };
  

 
  

  return (
    <>
      <div className="flex flex-row pr-10 pl-4 justify-between pt-4">
        <div className="w-2/12">
          <div className="my-3">
            <Select
              className="w-full"
              value={activeCateg}
              onChange={categoryHandler}
              label="Select Category"
            >
              <Option value="all">All</Option>
              {distinctCategory &&
                distinctCategory.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
            </Select>
          </div>
          <div className="mb-3">
            <Select
              className="w-full"
              value={activeBrand}
              onChange={brandHandler}
              label="Select Brand"
            >
              <Option value="all">All</Option>
              {distinctBrand &&
                distinctBrand.map((brand) => (
                  <Option key={brand} value={brand}>
                    {brand}
                  </Option>
                ))}
            </Select>
          </div>
          <div className="mb-3">
            <Select
              className="w-full"
              value={activePrice}
              onChange={priceHandler}
              label="Select Price"
            >
              <Option value="all">All</Option>
              {prices &&
                prices.map((price) => (
                  <Option key={price.value} value={price.value}>
                    {price.name}
                  </Option>
                ))}
            </Select>
          </div>




          <div className="mb-3">
            <Select
              className="w-full"
              value={activeRating}
              onChange={ratingHandler}
              label="Select Rating"
            >
              <Option value="all">All</Option>

              {ratings && ratings.map((rating) => (
                  <Option key={rating} value={rating}>
                    {rating} star{rating > 1 && "s"} & up
                  </Option>
                ))}

            </Select>
          </div>



        </div>


        <div className="md:col-span-3 w-9/12">
          <div className="mb-2 flex items-center justify-between border-b-2 pb-2">
            <div className="flex items-center">
              {productlist.length === 0 ? "No" : productlist.length} Results
              {query !== "all" && query !== "" && " : " + query}
              {category !== "all" && " : " + category}
              {brand !== "all" && " : " + brand}
              {price !== "all" && " : Price " + price}
              {rating !== "all" && " : Rating " + rating + " & up"}
              &nbsp;
              {(query !== "all" && query !== "") ||
              category !== "all" ||
              brand !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <button onClick={() => router.push("/search")}>
                  <XCircleIcon className="h-5 w-5" />
                </button>
              ) : null}
            </div>

            <div>
              <Select
                value={activeSort}
                onChange={sortHandler}
                label="Select Sort"
              >
                <Option value="featured">Featured</Option>
                <Option value="lowest">Price: Low to High</Option>
                <Option value="highest">Price: High to Low</Option>
                <Option value="toprated">Customer Reviews</Option>
                <Option value="newest">Newest Arrivals</Option>
              </Select>
            </div>
          </div>


          <div>
            <div className="flex flex-row justify-between">
              <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-4 gap-x-10 mt-4 mb-5">
                {productlist.map((product) => (
                  <div key={product._id} className="flex">
                    <Product product={product} />
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>

      <div>
            <ul className="flex justify-center mt-3">
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={prev}
                disabled={active === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>
              {products.length > 0 &&
                [...Array(pages).keys()].map((pageNumber) => (
                  <li key={pageNumber}>
                    <IconButton
                      {...getItemProps(pageNumber + 1)}
                      onClick={() => pageHandler(pageNumber + 1)}
                    >
                      {pageNumber + 1}
                    </IconButton>
                  </li>
                ))}

              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-2"
                onClick={next}
                disabled={active === pages}
              >
                Next
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </ul>
            </div>
    </>
  );
}
