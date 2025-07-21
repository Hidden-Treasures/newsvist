"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function DashboardPage() {
  const [showNewsUploadModal, setShowNewsUploadModal] = useState(false);
  const { user } = useAuth();

  const displayNewsUploadModal = () => {
    setShowNewsUploadModal(true);
  };

  const hideNewsUploadModal = () => {
    setShowNewsUploadModal(false);
  };

  return (
    <div>
      {/* Page-specific content */}
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <button
        onClick={displayNewsUploadModal}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
      >
        Add News
      </button>
      {showNewsUploadModal && (
        <div className="modal">
          {/* Modal content for news upload */}
          <button onClick={hideNewsUploadModal}>Close</button>
        </div>
      )}
    </div>
  );
}
