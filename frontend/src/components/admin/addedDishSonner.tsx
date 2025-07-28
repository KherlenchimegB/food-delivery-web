// "use client";

// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";

// export const SonnerAddedDish = () => {
//   return (
//     <Button
//       variant="outline"
//       onClick={() =>
//         toast("New dish is being added to the menu", {
//           //   description: "Sunday, December 03, 2023 at 9:00 AM",
//           //   action: {
//           //     label: "Undo",
//           //     onClick: () => console.log("Undo"),
//           //   },
//         })
//       }
//     >
//       Add dish
//     </Button>
//   );
// };

// import { useState } from "react";

// export const AddDishesButton = ({
//   categoryProp,
// }: {
//   categoryProp?: string;
// }) => {
//   const [selectedCategory, setSelectedCategory] = useState<string>(
//     categoryProp || ""
//   );

//   // category сонгосон бол өөрчлөх
//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category);
//     // хэлбэлзүүлж, setValue ашиглан form руу дамжуулах шаардлагагүй
//   };

//   const onSubmit = async (formData: AddDishFormData) => {
//     // category-ийг энд include хийх
//     const dataToSend = { ...formData, category: selectedCategory };

//     // Backend рүү илгээх
//     // ...
//   };

//   return (
//     <>
//       {/* Category сонгох товчнууд */}
//       <div className="flex gap-2 mb-4">
//         <Button
//           onClick={() => handleCategorySelect("appetizer")}
//           className={`px-4 py-2 ${
//             selectedCategory === "appetizer" ? "bg-blue-500 text-white" : ""
//           }`}
//         >
//           Appetizer
//         </Button>
//         <Button
//           onClick={() => handleCategorySelect("main")}
//           className={`px-4 py-2 ${
//             selectedCategory === "main" ? "bg-blue-500 text-white" : ""
//           }`}
//         >
//           Main Dish
//         </Button>
//         <Button
//           onClick={() => handleCategorySelect("dessert")}
//           className={`px-4 py-2 ${
//             selectedCategory === "dessert" ? "bg-blue-500 text-white" : ""
//           }`}
//         >
//           Dessert
//         </Button>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//         {/* бусад талбар */}
//         {/* ... */}

//         {/* Тухайн category харагдах байдлаар олон тоогоор дамжуулаагүй */}
//         {/* ... */}

//         {/* Илгээх товч */}
//         <Button type="submit" disabled={!selectedCategory || isSubmitting}>
//           {isSubmitting ? "Adding..." : "Add dish"}
//         </Button>
//       </form>
//     </>
//   );
// };
