import React, { useContext } from "react";

export default function NoPage() {
  return (
      <div className="w-full flex justify-center">
          <div className="w-[1100px] h-[calc(100vh-80px)] mt-[80px]">
              <div className="w-full h-[500px] flex items-center justify-center">
                  <h1>404 not found</h1>
              </div>
          </div>
      </div>
  );
}