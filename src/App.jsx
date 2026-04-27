import { useState } from "react";
import { useForm } from "react-hook-form";

export default function App() {
    const { 
        register, handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm()

    const onSubmit = (data) => { 
        console.log('data', data)
    }

    return (
        <>
        <h1>PopChoice</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>What’s your favorite movie and why?</label>
                    <input
                        {
                        ...register('favoriteMovie', { required: "We'd like to learn about your favorite movie :)"})
                        }
                    />

                </div>
                <button type="submit">Submit</button>
            <label>Are you in the mood for something new or a classic?</label>
            <label>Do you wanna have fun or do you want something</label>
        </form>
      </>
    );
}