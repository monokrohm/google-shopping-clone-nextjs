import { ProductData } from "@/typings";
import { getFetchUrl } from "@/util/getFetchUrl";
import { StarIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";

export const revalidate = 300;

type Props = {
  params: {
    id: string;
  };
};

async function ProductPage({ params: { id } }: Props) {
  const response = await fetch(getFetchUrl(`api/shopping/product/${id}`));
  const productData = (await response.json()) as ProductData;

  if (!productData.content.pricing) {
    notFound();
  }

  return (
    <div className="p-12 pt-0">
      <h1 className="text-2xl">{productData.content.title}</h1>

      {/* STAR RATING */}
      {productData.content.reviews && (
        <div className="flex space-x-1">
          {[
            ...Array.from({
              length: Math.round(productData.content.reviews.rating),
            }),
          ].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
          ))}

          {/* Show Remaining Blank Stars */}
          {[
            ...Array.from({
              length: 5 - Math.round(productData.content.reviews.rating),
            }),
          ].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 text-gray-200" />
          ))}
        </div>
      )}

      {/* PRODUCT IMAGES */}
      <section className="flex flex-col mt-5 md:mt-0 lg:flex-row">
        <div className="md:p-10 md:pl-0 mx-auto">
          <div className="flex gap-4">
            <img
              src={productData.content.images?.full_size[0]}
              alt=""
              className="h-80 w-80 p-5 object-contain border rounded-md"
            />
            <div className="flex flex-col justify-between">
              {productData.content.images?.full_size
                .slice(1, 3)
                .map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt=""
                    className="w-[9.25rem] h-[9.25rem] object-contain border rounded-md"
                  />
                ))}
            </div>
          </div>

          <div className="flex space-x-6 py-2 overflow-x-auto md:w-[30rem]">
            {productData.content.images?.full_size.slice(3).map((image, i) => (
              <img
                key={i}
                src={image}
                alt=""
                className="w-20 h-20 object-contain"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 pt-10">
          <div>
            {productData.content.pricing.online[0].details && (
              <>
                <h3 className="font-bold text-2xl">Product Details</h3>
                <p className="text-lg">
                  {productData.content.pricing.online[0].price_total}{" "}
                  {productData.content.pricing.online[0].currency}
                </p>

                {/* Price breakdown */}
                <div className="flex space-x-4">
                  <p className="text-sm text-gray-600">
                    ({productData.content.pricing.online[0].price}{" "}
                    {productData.content.pricing.online[0].currency} +{" "}
                    {productData.content.pricing.online[0].price_tax}{" "}
                    {productData.content.pricing.online[0].currency} tax)
                  </p>

                  {/* More price options */}
                  {productData.content.pricing.online.length > 1 && (
                    <p className="text-sm text-[#1B66D2]">
                      + {productData.content.pricing.online.length - 1} more
                      prices
                    </p>
                  )}
                </div>

                {/* Shipping */}
                <p className="mt-5 text-sm text-gray-600">
                  {productData.content.pricing.online[0].details}
                </p>
              </>
            )}

            <hr className="my-5" />

            <p>{productData.content.description}</p>

            {productData.content.highlights && (
              <div className="mt-5 space-y-2">
                <h3 className="font-bold text-2xl">Product Highlights</h3>
                <hr />
                <ul className="space-y-2">
                  {productData.content.highlights?.map((highlight, i) => (
                    <li key={i} className="list-disc">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section>
        <hr className="my-10" />
        {productData.content.reviews ? (
          <>
            <h3 className="font-bold text-2xl">
              Reviews ({productData.content.reviews.rating}){" "}
            </h3>

            <h4 className="text-lg italic">Top Reviews</h4>

            {productData.content.reviews.top_review && (
              <div className="mt-2 p-5 rounded-lg border">
                <div className="flex space-x-1">
                  <p className="font-bold capitalize">
                    {productData.content.reviews.top_review.author} says:
                  </p>

                  <h5>{productData.content.reviews.top_review.title} </h5>
                </div>
                <div className="flex space-x-1 mb-2">
                  {[
                    ...Array.from({
                      length: Math.round(
                        productData.content.reviews.top_review.rating
                      ),
                    }),
                  ].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                  ))}
                </div>

                <p>&quot;{productData.content.reviews.top_review.text}&quot;</p>
              </div>
            )}
          </>
        ) : (
          <div>
            <h3 className="font-bold text-2xl">Reviews</h3>

            <h4 className="text-lg italic">No Reviews yet</h4>
          </div>
        )}
      </section>

      {/* SPECIFICATIONS */}
      {productData.content.specifications && (
        <section>
          <hr className="my-10" />

          <h3 className="font-bold text-2xl">Specifications</h3>

          <div className="flex flex-wrap space-x-5">
            {productData.content.specifications.map((spec) => (
              <div key={spec.section_title}>
                <h4 className="my-2 font-bold text-xl">{spec.section_title}</h4>

                {spec.items.map((items) => (
                  <div key={items.title} className="text-sm">
                    <h5 className="font-bold">{items.title}</h5>
                    <p>{items.value}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductPage;
