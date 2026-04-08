function Features() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold mb-10">
        Why Use This Tool?
      </h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-muted p-6 rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-2">⚡ Fast</h3>
          <p className="text-gray-400">
            Get answers instantly from your documents.
          </p>
        </div>
        <div className="bg-muted p-6 rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-2">🔒 Secure</h3>
          <p className="text-gray-400">
            Your files are private and protected.
          </p>
        </div>
        <div className="bg-muted p-6 rounded-lg border border-gray-800">
          <h3 className="font-semibold mb-2">🎯 Accurate</h3>
          <p className="text-gray-400">
            AI answers based on your data.
          </p>
        </div>
      </div>
    </section>
  );
}
export default Features;