"use client";

import BioForm from "@/components/forms/BioForm";
import ConfirmModal from "@/components/modals/confirmModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBiography, useDeleteBiography } from "@/hooks/useAuth";
import { Biography } from "@/services/types";
import Image from "next/image";
import React, { useState } from "react";
import { Plus, Trash2 } from "react-feather";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";

const BiographyPage = () => {
  const [selectedBiography, setSelectedBiography] = useState<Biography | null>(
    null
  );
  const [deletedItemId, setDeletedItemId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { mutate: deleteBio, isPending } = useDeleteBiography();
  const { data, isLoading, isError, refetch } = useBiography();

  const handleEditClick = (biography: Biography) => {
    setSelectedBiography(biography);
    setModalOpen(true);
  };

  const displayConfirmModal = (id: string) => {
    setDeletedItemId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = () => {
    if (deletedItemId) {
      deleteBio(deletedItemId);
      setShowConfirmModal(false);
    }
  };

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Biography Management</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Biography
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <CardTitle>All Biographies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((bio, i) => (
                <motion.tr
                  key={bio._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-800/40"
                >
                  <TableCell>
                    <img
                      src={bio.image ?? "/placeholder.png"}
                      alt={bio.realName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{bio.realName}</div>
                    <div className="text-xs text-slate-400">
                      {bio.stageName || bio.aliasName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{bio.category}</Badge>
                  </TableCell>
                  <TableCell>{bio.occupations?.[0] ?? "N/A"}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-600">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(bio)}
                      className="text-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => displayConfirmModal(bio._id)}
                      className="ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmModal(false)}
        title="Are you sure?"
        subtitle="This action will permanently delete this biography!"
        busy={isPending}
      />

      {isModalOpen && (
        <BioForm
          biographyData={selectedBiography}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}
    </main>
  );
};

export default BiographyPage;
