const NoProductMessage = () => {
  return (
    <div className="h-full flex-1 flex justify-center py-32 p-6 text-center">
      <div>
        <h2 className="text-2xl font-medium text-gray-800 mb-3 max-sm:text-white">
          Let's style you
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Start chatting with our assistant to see personalized product
          recommendations.
        </p>
      </div>
    </div>
  );
};

export default NoProductMessage;
