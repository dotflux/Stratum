import Loader from "../../SignUp/Loader";

const DeletingModal = ({}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl max-w-xl w-full p-6 relative">
        <h2 className="text-2xl font-extrabold text-white mb-4">Deleting...</h2>
        <Loader />
      </div>
    </div>
  );
};

export default DeletingModal;
