import { useState } from "react";
import { useForm } from "react-hook-form";

export default function App() {
    const { 
        register, handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm()

    const onSubmit = (data) => { 
        console.log('data', data)
        fetch('http://localhost:3000/recommendation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    return (
      <>
        <h1>PopChoice</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>What’s your favorite movie and why?</label>
            <input
              {...register("favorite_movie", {
                  required: "We'd like to learn about your favorite movie :)",
                  value: "Inception"
              })}
            />
          </div>

          <div>
            <label>Are you in the mood for something new or a classic?</label>
            <input
              {...register("newness", {
                  required: "We'd like to learn about your favorite movie :)",
                  value: "New all the way!"
              })}
            />
          </div>

          <div>
            <label>Do you wanna have fun or do you want something</label>
            <input
              {...register("fun_or_serious", {
                  required: "We'd like to learn about your favorite movie :)",
                  value: "A generous splash of fun please!"
              })}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </>
    );
}