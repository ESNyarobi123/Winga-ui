"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Flag
} from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { useT } from "@/lib/i18n";
import type { JobListItem } from "@/types";

type JobDetailPanelProps = {
  job: JobListItem | null;
  onClose: () => void;
  onApply: () => void;
  isLoggedIn: boolean;
  saved?: boolean;
  onSaveToggle?: (jobId: string) => void;
};

export function JobDetailPanel({
  job,
  onClose,
  onApply,
  isLoggedIn,
  saved = false,
  onSaveToggle,
}: JobDetailPanelProps) {
  const t = useT();
  const { isOpen, onOpen, onClose: onCloseModal } = useDisclosure();
  const [applying, setApplying] = useState(false);

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      onOpen();
      return;
    }
    setApplying(true);
    onApply();
    setTimeout(() => setApplying(false), 500);
  };

  if (!job) return null;

  const jobId = String(job.id);

  return (
    <>
      <div className="flex flex-col h-full bg-white w-full">
        {/* Header: back, bookmark, external link, report */}
        <div className="flex items-center justify-between shrink-0 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label={t("job.backToJobs")}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSaveToggle?.(jobId)}
              className="flex items-center justify-center p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label={saved ? "Remove from saved" : "Save job"}
            >
              {saved ? (
                <BookmarkCheck className="w-5 h-5 text-[#006B3E]" strokeWidth={2.5} />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
              )}
            </button>
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Copy Link"
            >
              <ExternalLink className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Report"
            >
              <Flag className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-24">
          {/* Title & Employment Type */}
          <div className="mb-6 pt-2">
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight mb-3">
              {job.title}
            </h2>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[14px] font-semibold bg-[#E8F3EE] text-[#006B3E]">
                {t("job.fullTime") || "Full-time"}
              </span>
              <span className="text-[14px] text-gray-500 font-medium">
                3 hours ago
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Job Description */}
            <section>
              <h3 className="flex items-center gap-2 font-semibold text-[#006B3E] text-lg mb-3">
                <span className="text-xl">📃</span> {t("job.jobDescription") || "Job Description"}
              </h3>
              <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                {job.description || "—"}
              </p>
            </section>

            {/* Preferred Gender */}
            <section>
              <h3 className="flex items-center gap-2 font-semibold text-[#006B3E] text-lg mb-3">
                <span className="text-xl">👷</span> {t("job.preferredGender") || "Preferred Gender"}
              </h3>
              <span className="inline-block text-[15px] font-medium text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {t("job.any") || "Any"}
              </span>
            </section>

            {/* Wage/Salary */}
            <section>
              <h3 className="flex items-center gap-2 font-semibold text-[#006B3E] text-lg mb-3">
                <span className="text-xl">💰</span> {t("job.wageSalary") || "Wage/Salary"}
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-medium">{t("job.wage") || "Wage"}</span>
                  <span className="text-[15px] font-bold text-gray-900">{job.budget || "$20 - $40"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-medium">{t("job.payoutFrequency") || "Payout Frequency"}</span>
                  <span className="text-[15px] font-bold text-gray-900">{job.budgetType || "Weekly"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-600 font-medium">{t("job.paymentType") || "Payment Type"}</span>
                  <span className="text-[15px] font-bold text-gray-900">Crypto, ACH</span>
                </div>
              </div>
            </section>

            {/* Skills & Expertise (tags from API) */}
            <section>
              <h3 className="flex items-center gap-2 font-semibold text-[#006B3E] text-lg mb-3">
                <span className="text-xl">🧠</span> {t("job.skillsExpertise") || "Skills & Expertise"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(job.tags) ? job.tags : []).length > 0 ? (
                  (Array.isArray(job.tags) ? job.tags : []).map((tag, i) => (
                    <Chip
                      key={`${i}-${String(tag)}`}
                      variant="bordered"
                      className="border-[#006B3E]/30 text-[#006B3E] font-semibold text-[14px] bg-[#E8F3EE]/50 h-9 px-4"
                    >
                      {tag}
                    </Chip>
                  ))
                ) : (
                  <span className="text-default-500 text-sm">—</span>
                )}
              </div>
            </section>

            {/* Social Media */}
            <section>
              <h3 className="flex items-center gap-2 font-semibold text-[#006B3E] text-lg mb-3">
                <span className="text-xl">📱</span> {t("job.socialMedia") || "Social Media"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Chip variant="flat" className="bg-gray-100 text-gray-700 font-semibold h-9 px-4">Instagram</Chip>
                <Chip variant="flat" className="bg-gray-100 text-gray-700 font-semibold h-9 px-4">TikTok</Chip>
              </div>
            </section>

            {/* Languages */}
            <section>
              <h3 className="flex items-center gap-2 font-semibold text-[#006B3E] text-lg mb-3">
                <span className="text-xl">🌐</span> {t("job.languages") || "Languages"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Chip
                  variant="bordered"
                  className="border-[#006B3E]/30 text-[#006B3E] font-semibold text-[14px] bg-[#E8F3EE]/50 h-9 px-4"
                >
                  English - Fluent/Native
                </Chip>
              </div>
            </section>

            {/* Software */}
            <section>
              <h3 className="flex items-center gap-2 font-semibold text-[#006B3E] text-lg mb-3">
                <span className="text-xl">💻</span> {t("job.software") || "Software"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Chip
                  variant="bordered"
                  className="border-[#006B3E]/30 text-[#006B3E] font-semibold text-[14px] bg-[#E8F3EE]/50 h-9 px-4"
                >
                  CapCut
                </Chip>
                <Chip
                  variant="bordered"
                  className="border-[#006B3E]/30 text-[#006B3E] font-semibold text-[14px] bg-[#E8F3EE]/50 h-9 px-4"
                >
                  Premiere Pro
                </Chip>
              </div>
            </section>
          </div>
        </div>

        {/* Sticky Apply at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Button
            size="lg"
            className="w-full font-bold text-[16px] h-14 bg-[#006B3E] hover:bg-[#005732] text-white rounded-xl shadow-lg"
            onPress={handleApplyClick}
            isLoading={applying}
          >
            {t("job.apply") || "Apply"}
          </Button>
        </div>
      </div>

      {/* Modal: Please login to apply */}
      <Modal isOpen={isOpen} onOpenChange={(open) => !open && onCloseModal()} placement="center">
        <ModalContent>
          <ModalBody className="pt-6">
            <p className="text-default-700">{t("job.loginToApply") || "Please login to apply for this job."}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseModal}>
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button as={Link} href={`/login?returnUrl=${encodeURIComponent("/find-jobs")}`} color="primary">
              {t("auth.login") || "Login"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
