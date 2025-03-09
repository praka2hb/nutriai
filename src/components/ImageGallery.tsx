"use client"

import Image from "next/image"

const images = [
  { src: "/freshveggie.jpg?height=200&width=300", alt: "Fresh vegetables", width: 300, height: 200 },
  { src: "/healthymeal.jpg?height=200&width=300", alt: "Healthy meal prep", width: 300, height: 200 },
  { src: "/equipments.jpg?height=200&width=300", alt: "Fitness equipment", width: 300, height: 200 },
  { src: "/smoothie.jpg?height=200&width=300", alt: "Nutritious smoothie", width: 300, height: 200 },
]

export default function ImageGallery() {

  return (
    <div className="p-8 bg-zinc-300 bg-opacity-50">
    <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-8">Nutrition Gallery</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((img, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group aspect-[3/2]"
        >
          <Image
            src={img.src || "/placeholder.svg"}
            alt={img.alt}
            width={img.width}
            height={img.height}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-center text-sm px-2">{img.alt}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

