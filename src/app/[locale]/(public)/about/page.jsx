import React from 'react'

export default function page() {
  return (
    <div>
        
      {/* Hero Section */}
      <section
        className="w-full px-4 sm:px-8 lg:px-10 py-10 flex flex-col items-center justify-center text-center rounded-xl bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhJPj_gfrjHmExStwAekJNuV4jZ1cJaT7zsd5gi4ggDRbT5poPp1KRjkwXSXaOQsb3PQ0KSVWKO-hLOZ3L5_Xuq-j5OOzdpevUtrZToqDunRO_MmjIuS6J1S9ZaFLOovk912b6XHMsDHSp1whHC29KzWw2_w_JdhsehBymjdRvtMSKqaxZ5QjZwq-BODm67ybcCgCuD5GV0gqIOrAIvHFCSdsIQ2C0pYJURBq8ftbyHBSVWfnacKR9jBacBuKumSvDlLDYGmkBwe4')`,
        }}
      >
        <h2 className="text-white text-4xl sm:text-5xl font-black mb-2">The Story of Az</h2>
        <p className="text-white text-base sm:text-lg max-w-md mb-4">
          Blending timeless craftsmanship with modern style since our inception.
        </p>
        <button className="px-5 py-3 bg-primary text-black rounded-lg font-bold hover:opacity-90 transition-opacity">
          Explore the Collection
        </button>
      </section>

      {/* About / Features */}
      <section className="w-full px-4 sm:px-8 lg:px-10 py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 flex flex-col gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">Our History & Mission</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Az Store was founded on the principle of creating footwear that doesn't just look good, but feels exceptional. We are dedicated to the art of shoemaking, combining traditional techniques with contemporary design to bring you shoes that are both timeless and modern. Our commitment is to quality, sustainability, and the perfect fit for every customer.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="w-full aspect-square rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALk-UyTX936kIG2iyOY7XJ5Y3Az8Bz-NdqMOfTST3sKivMQ7qg3D3qLGoxAHawqnlA61F1Ti8Ph2dFnhO3_9RICUGFCEUf5o1Y2xfuQOYP3kaBXdnsq_51c9rTGjqBWmcuoHrAqUoPi4I8qqSA6ehSnLcVH1W7AjZC4r0Nkckango27wBJpn-p8-sJhEy49bei6PxTnWBW_BD0ghxRz5SVQ2Yu7qy_pRWLBf83JLSycj99xFUPOApXcrbfgCI4ly7ZotXIOvZK3rg')" }}></div>
              <h3 className="text-black dark:text-white font-medium">Our Founding Story</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Discover our passion for quality footwear.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-full aspect-square rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCai7ZpfNIDQyaxJjjcq_ICAucN4p4nnV9GR0P6oPqdhEa-OeekEi0L1FpLBXSexP4sRt0HFjY7NJyVHeevIoEBBCmJGk6JswVh1qI1mbVg-3U7rJOtyTPwp4vR8JaInwH-3md9sDRD-DAyWRDtWIur0WaaUYF-BLruiqq66FuR93YXhNHbkIk-23aEhkbeqaQteaGxnGIBCK9RrDYQF7Ya5aUM-6ROS_urVoZFnSjxr6KTZDYj61DrPOBIwSuxPeLRudDorOMRSdg')" }}></div>
              <h3 className="text-black dark:text-white font-medium">Our Philosophy</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Crafting style, comfort, and sustainability.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
