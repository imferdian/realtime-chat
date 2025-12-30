"use client";

import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  )
}

export default Page;

function Lobby() {
  const { username } = useUsername();
  const router = useRouter();

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        {wasDestroyed && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">
              YAHH!!, ROOM CHAT TELAH DIHANCURKAN
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Semua pesan dah dihapus permanen
            </p>
          </div>
        )}
        {error === "room-not-found" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">
              ROOM CHAT GAK DITEMUKAN
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Room ini mungkin udah expired atau udah dihapus
            </p>
          </div>
        )}
        {error === "room-full" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">
              ROOMNYA UDAH FULL!!
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Room chat ini dah penuh
            </p>
          </div>
        )}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {"> "}private_chat
          </h1>
          <p className="text-zinc-500 text-sm">
            {" "}
            A private, self-destructing chat room{" "}
          </p>
        </div>
        <div className="border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="" className="flex items-center text-zinc-500">
                Identitas Kamu
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-400 p-3">
                  {username}
                </div>
              </div>
            </div>
            <button
              className="w-full bg-zinc-200 text-black p-3 text-sm font-bold hover:text-black hover:bg-zinc-50 transition-colors disabled:opacity-50 mt-2 cursor-pointer"
              onClick={() => createRoom()}
            >
              Buat Room
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
