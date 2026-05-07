import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { create } from "zustand";

const useRecommendation = create((set) => ({
  favorite_movie: "",
  update_favorite_movie: (fav_movie) => set(() => ({ favorite_movie: fav_movie })),

  newness: "",
  update_newness: (newness) => set(() => ({ newness: newness })),

  fun_or_serious: "",
  update_fun_or_serious: (fun_or_serious) => set(() => ({ fun_or_serious: fun_or_serious })),
}));

export default function App() {
    const { 
        register, handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm()

    const onSubmit = async (data) => { 
      console.log('data', data)
      try {
        const response = await fetch('http://localhost:3000/recommendation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()
        console.log('result', result)
      } catch (err) { 
        console.error(err)
        throw err
      }
    }

    return (
      <>
        <div className="grid place-content-center">
          <img src="assets/PopChoice Icon.png" className="w-24"></img>
          <h1>PopChoice</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>What’s your favorite movie and why?</label>
              <Input
                className={"bg-light-blue-purple"}
                {...register("favorite_movie", {
                  required: "We'd like to learn about your favorite movie :)",
                  value: "Inception",
                })}
              />
            </div>

            <div>
              <label>Are you in the mood for something new or a classic?</label>
              <Input
                className={"bg-light-blue-purple"}
                {...register("newness", {
                  required: "We'd like to learn about your favorite movie :)",
                  value: "New all the way!",
                })}
              />
            </div>

            <div>
              <label>
                Do you wanna have fun or do you want something serious?
              </label>
              <Input
                className={"bg-light-blue-purple"}
                {...register("fun_or_serious", {
                  required: "We'd like to learn about your favorite movie :)",

                  value: "A generous splash of fun please!",
                })}
              />
            </div>
            <button type="submit" className="text-black bg-green-pasty ">
              Let's Go
            </button>
          </form>
        </div>
      </>
    );
}