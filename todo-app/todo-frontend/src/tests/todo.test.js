import React from "react"
import { render, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom';
import Todo from "../Todos/Todo"


describe("Todo", () => {
    const todo = {
        id: 1,
        text: "Test todo",
        done: false
    }
    const onClickDelete = jest.fn()
    const onClickComplete = jest.fn()

    it("renders todo", () => {
        const { getByText } = render(
            <Todo
                todo={todo}
                onClickDelete={onClickDelete}
                onClickComplete={onClickComplete}
            />
        )

        expect(getByText(todo.text)).toBeInTheDocument()
    })

    it ("calls onClickDelete when delete button is clicked", () => {
        const { getByText } = render(
            <Todo
                todo={todo}
                onClickDelete={onClickDelete}
                onClickComplete={onClickComplete}
            />
        )

        fireEvent.click(getByText("Delete"))
        expect(onClickDelete).toHaveBeenCalledWith(todo)
    })
})
