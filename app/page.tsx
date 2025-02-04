"use client";
import Todo from "./components/Todo";
import { useRef } from 'react';
import { TodoType } from "./types";
import { useRouter } from "next/navigation";
import { useTodos } from "./hooks/useTodos";
import { API_URL } from "./constants/url";

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);// 入力フィールドの参照
  const router = useRouter();// ルーターの取得
  const { todos, mutate } = useTodos();// todoリストを取得

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ページリロードを防ぐ

    // 入力が空なら処理を中断
    if (!inputRef.current?.value.trim()) {
      alert("Todoのタイトルを入力してください");
      return;
    }

    // 新しいtodoを作成
    const response = await fetch(`${API_URL}/createTodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: inputRef.current?.value,
        isCompleted: false
      })
    });

    // リスト全体を最新状態にするためrefreshを使用
    router.refresh();
    if (response.ok) {
      const newTodo = await response.json();
      mutate([...todos, newTodo]);
      inputRef.current!.value = "";
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
      </div>

      <form className="w-full max-w-sm mx-auto px-4 py-2" onSubmit={handlesubmit}>
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Add a task"
            ref={inputRef}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo: TodoType) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
