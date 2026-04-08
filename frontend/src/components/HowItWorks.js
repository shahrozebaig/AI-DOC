function HowItWorks() {
  return (
    <section className="py-20 px-6 text-center">

      <h2 className="text-3xl font-bold mb-10">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        <div className="bg-muted p-6 rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-2">1. Upload PDF</h3>
          <p className="text-gray-400">
            Upload your document securely.
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-2">2. Ask Questions</h3>
          <p className="text-gray-400">
            Ask anything related to your file.
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-2">3. Get Answers</h3>
          <p className="text-gray-400">
            AI gives instant responses.
          </p>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;