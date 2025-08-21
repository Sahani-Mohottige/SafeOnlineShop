import {
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-green-600 bg-green-100 p-4 rounded-full mb-4">
              <HiShoppingBag className="text-3xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              FREE INTERNATIONAL SHIPPING
            </h4>
            <p className="text-gray-600 text-sm">On all orders over $100.00</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 bg-blue-100 p-4 rounded-full mb-4">
              <HiArrowPathRoundedSquare className="text-3xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              45 DAYS RETURN
            </h4>
            <p className="text-gray-600 text-sm">Money back guarantee</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-purple-600 bg-purple-100 p-4 rounded-full mb-4">
              <HiOutlineCreditCard className="text-3xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              SECURE CHECKOUT
            </h4>
            <p className="text-gray-600 text-sm">
              100% secured checkout process
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
