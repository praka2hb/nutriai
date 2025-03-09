// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { X } from "lucide-react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import axios from "axios"
// import { toast } from "sonner"
// import { useSession } from "next-auth/react"

// const formSchema = z.object({
//   age: z.number().min(1).max(120),
//   height: z.number().min(1),
//   heightUnit: z.string().default("cm"),
//   weight: z.number().min(1),
//   weightUnit: z.string().default("kg"),
//   allergies: z.array(z.string()).default([]),
//   foodPreferences: z.array(z.string()).default([]),
// })

// const foodPreferenceOptions = [
//   { id: "vegetarian", label: "Vegetarian" },
//   { id: "vegan", label: "Vegan" },
//   { id: "pescatarian", label: "Pescatarian" },
//   { id: "gluten-free", label: "Gluten Free" },
//   { id: "dairy-free", label: "Dairy Free" },
//   { id: "keto", label: "Keto" },
//   { id: "paleo", label: "Paleo" },
// ]

// export default function UserMetadataModal() {
//   const [open, setOpen] = useState(false)
//   const [id, setId ] = useState("")
//   const [allergyInput, setAllergyInput] = useState("")
//   const { data: session } = useSession(); // ⬅️ Move hook to top level

//   useEffect(() => {
//     if (session?.user?.id) {
//       setId(session.user.id)
//     }
//   }, [session?.user?.id])

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       age: undefined,
//       height: undefined,
//       heightUnit: "cm",
//       weight: undefined,
//       weightUnit: "kg",
//       allergies: [],
//       foodPreferences: [],
//     },
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try{
//       const res = await axios.post("/api/user-meta", {
//         age: values.age,
//         height: values.height,
//         weight: values.weight,
//         userId: id,
//         allergies: values.allergies,
//         foodPreferences: values.foodPreferences,
//       })
//       if (res.status === 201){
//         setOpen(false)
//         toast("Metadata Added Successfully")
//       }
//     }
//     catch(error){
//       toast("Failed to Add Metadata")
//       setOpen(false)
//     }
//   }

//   function addAllergy(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (e.key === "Enter" && allergyInput.trim() !== "") {
//       e.preventDefault()
//       const currentAllergies = form.getValues("allergies")
//       if (!currentAllergies.includes(allergyInput.trim())) {
//         form.setValue("allergies", [...currentAllergies, allergyInput.trim()])
//       }
//       setAllergyInput("")
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>User Metadata</Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>User Metadata</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-3 gap-3">
//               <FormField
//                 control={form.control}
//                 name="age"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Age</FormLabel>
//                     <FormControl>
//                       <Input
//                         min={0}
//                         type="number"
//                         placeholder="Age"
//                         {...field}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="height"
//                 render={({ field }) => (
//                   <FormItem className="col-span-2">
//                     <FormLabel>Height</FormLabel>
//                     <div className="flex gap-2">
//                       <FormControl>
//                         <Input
//                         min={0}
//                           type="number"
//                           placeholder="Height"
//                           {...field}
//                           onChange={(e) => field.onChange(Number(e.target.value))}
//                           className="flex-1"
//                         />
//                       </FormControl>
//                       <Select
//                         value={form.watch("heightUnit")}
//                         onValueChange={(value) => form.setValue("heightUnit", value)}
//                       >
//                         <SelectTrigger className="w-16">
//                           <SelectValue placeholder="Unit" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="cm">cm</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="weight"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Weight</FormLabel>
//                   <div className="flex gap-2">
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="Weight"
//                         {...field}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         className="flex-1"
//                       />
//                     </FormControl>
//                     <Select
//                       value={form.watch("weightUnit")}
//                       onValueChange={(value) => form.setValue("weightUnit", value)}
//                     >
//                       <SelectTrigger className="w-16">
//                         <SelectValue placeholder="Unit" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="kg">kg</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="allergies"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Allergies</FormLabel>
//                   <FormControl>
//                     <div>
//                       <Input
//                         placeholder="Type allergy + Enter"
//                         value={allergyInput}
//                         onChange={(e) => setAllergyInput(e.target.value)}
//                         onKeyDown={addAllergy}
//                       />
//                       <div className="flex flex-wrap gap-1 mt-1">
//                         {form.watch("allergies").map((allergy) => (
//                           <Badge key={allergy} variant="secondary" className="flex items-center gap-1 text-xs">
//                             {allergy}
//                             <X
//                               className="h-3 w-3 cursor-pointer"
//                               onClick={() => {
//                                 const currentAllergies = form.getValues("allergies")
//                                 form.setValue(
//                                   "allergies",
//                                   currentAllergies.filter((item) => item !== allergy),
//                                 )
//                               }}
//                             />
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="foodPreferences"
//               render={() => (
//                 <FormItem>
//                   <FormLabel>Food Preferences</FormLabel>
//                   <div className="grid grid-cols-2 gap-1">
//                     {foodPreferenceOptions.map((option) => (
//                       <FormField
//                         key={option.id}
//                         control={form.control}
//                         name="foodPreferences"
//                         render={({ field }) => (
//                           <FormItem key={option.id} className="flex flex-row items-start space-x-2 space-y-0">
//                             <FormControl>
//                               <Checkbox
//                                 checked={field.value?.includes(option.id)}
//                                 onCheckedChange={(checked) => {
//                                   const currentValues = field.value || []
//                                   return checked
//                                     ? field.onChange([...currentValues, option.id])
//                                     : field.onChange(currentValues.filter((value) => value !== option.id))
//                                 }}
//                               />
//                             </FormControl>
//                             <FormLabel className="font-normal text-sm cursor-pointer">{option.label}</FormLabel>
//                           </FormItem>
//                         )}
//                       />
//                     ))}
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter className="pt-2">
//               <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" size="sm">
//                 Save
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

