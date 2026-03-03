"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Trophy,
  Target,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { freelancerService, type WorkerTestResultItem } from "@/services/freelancer.service";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function getTestIcon(testType: string) {
  const t = testType?.toLowerCase() ?? "";
  if (t.includes("typing") || t.includes("keyboard")) return "⌨️";
  if (t.includes("internet") || t.includes("speed")) return "📶";
  if (t.includes("verbal") || t.includes("mic")) return "🎤";
  if (t.includes("english") || t.includes("b1") || t.includes("b2") || t.includes("c1")) return "📚";
  return "📋";
}

function StatusBadge({ item: r }: { item: WorkerTestResultItem }) {
  const isCompleted = r.status === "COMPLETED" || r.addedToProfile;
  const hasAttempts = r.attemptsCount > 0 && !isCompleted;

  if (isCompleted) {
    return (
      <Chip
        size="sm"
        color="success"
        variant="flat"
        startContent={<CheckCircle2 className="w-3.5 h-3.5" />}
        classNames={{ base: "border border-success-200" }}
      >
        Completed
      </Chip>
    );
  }
  if (hasAttempts) {
    return (
      <Chip size="sm" color="warning" variant="flat">
        In progress
      </Chip>
    );
  }
  return (
    <Chip size="sm" variant="flat" color="default">
      Not started
    </Chip>
  );
}

export default function WorkerMyTestsPage() {
  const [results, setResults] = useState<WorkerTestResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [submitScore, setSubmitScore] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTest, setSelectedTest] = useState<WorkerTestResultItem | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await freelancerService.getMyTestResults();
      setResults(list);
    } catch {
      setError("Could not load tests. Try again later.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const openSubmitModal = (test: WorkerTestResultItem) => {
    if (test.status === "COMPLETED" || test.addedToProfile) return;
    if (test.attemptsCount >= test.maxAttempts) return;
    setSelectedTest(test);
    setSubmitScore("");
    onOpen();
  };

  const handleSubmitScore = async () => {
    if (!selectedTest) return;
    const score = parseInt(submitScore, 10);
    if (Number.isNaN(score) || score < 0) return;
    setSubmittingId(selectedTest.testId);
    try {
      const updated = await freelancerService.submitTestScore(selectedTest.testId, score);
      setResults((prev) =>
        prev.map((r) => (r.testId === updated.testId ? updated : r))
      );
      onClose();
      setSelectedTest(null);
      setSubmitScore("");
    } catch {
      setError("Failed to submit score.");
    } finally {
      setSubmittingId(null);
    }
  };

  const completedCount = results.filter((r) => r.addedToProfile || r.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-default-50 to-background">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-primary mb-1">
            <ClipboardCheck className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">Qualification tests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            My tests
          </h1>
          <p className="text-default-500 mt-1.5 text-[15px]">
            Complete tests to add them to your profile. Clients see completed tests on your profile.
          </p>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex items-center gap-2 text-default-600 text-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>
                {completedCount} of {results.length} completed
                {completedCount > 0 && " — visible on your profile"}
              </span>
            </motion.div>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/30 text-danger-700 dark:text-danger-400 text-sm flex items-center justify-between gap-3 flex-wrap"
          >
            <span>{error}</span>
            <Button size="sm" variant="flat" color="primary" onPress={() => fetchResults()}>
              Try again
            </Button>
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="rounded-2xl h-28 w-full" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-dashed border-default-200 dark:border-default-100 p-12 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-default-100 dark:bg-default-50 flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck className="w-7 h-7 text-default-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No tests available</h3>
            <p className="text-default-500 text-sm max-w-sm mx-auto">
              Qualification tests will appear here once your admin adds them. Check back later.
            </p>
          </motion.div>
        ) : (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {results.map((r) => {
                const canTake = r.status !== "COMPLETED" && !r.addedToProfile && r.attemptsCount < r.maxAttempts;
                return (
                  <motion.li key={r.testId} variants={item} layout>
                    <Card
                      className={`border transition-all duration-200 hover:shadow-md hover:border-primary/20 ${
                        r.addedToProfile ? "border-success-200 dark:border-success-500/30 bg-success-50/30 dark:bg-success-500/5" : "border-default-200"
                      }`}
                      shadow="sm"
                    >
                      <CardBody className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-default-100 dark:bg-default-50 flex items-center justify-center text-2xl shrink-0">
                              {getTestIcon(r.testType)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-foreground text-[15px] sm:text-base truncate">
                                {r.testName}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[13px] text-default-500">
                                <span className="flex items-center gap-1">
                                  <Target className="w-3.5 h-3.5" />
                                  Score: {r.minScore}–{r.maxScore}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Zap className="w-3.5 h-3.5" />
                                  Attempts: {r.attemptsCount}/{r.maxAttempts}
                                </span>
                                {r.bestScore != null && (
                                  <span className="flex items-center gap-1 text-primary font-medium">
                                    <Trophy className="w-3.5 h-3.5" />
                                    Best: {r.bestScore}
                                  </span>
                                )}
                              </div>
                              {r.addedToProfile && (
                                <Chip
                                  size="sm"
                                  color="success"
                                  variant="flat"
                                  className="mt-2 w-fit"
                                  startContent={<CheckCircle2 className="w-3.5 h-3.5" />}
                                >
                                  Added to your profile
                                </Chip>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <StatusBadge item={r} />
                            {canTake && (
                              <Button
                                color="primary"
                                size="sm"
                                className="font-semibold"
                                endContent={<ChevronRight className="w-4 h-4" />}
                                onPress={() => openSubmitModal(r)}
                              >
                                Take test
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      {/* Submit score modal */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center" classNames={{ base: "mx-4" }}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <span>Submit your score</span>
            {selectedTest && (
              <span className="text-sm font-normal text-default-500">{selectedTest.testName}</span>
            )}
          </ModalHeader>
          <ModalBody>
            {selectedTest && (
              <p className="text-sm text-default-500 mb-2">
                Enter your score (between {selectedTest.minScore} and {selectedTest.maxScore}). Passing: {selectedTest.minScore}+.
              </p>
            )}
            <Input
              type="number"
              label="Score"
              placeholder="e.g. 75"
              value={submitScore}
              onValueChange={setSubmitScore}
              min={selectedTest?.minScore ?? 0}
              max={selectedTest?.maxScore ?? 100}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSubmitScore}
              isDisabled={!submitScore.trim() || submittingId !== null}
              isLoading={submittingId !== null}
              startContent={submittingId === null ? undefined : <Loader2 className="w-4 h-4 animate-spin" />}
            >
              Submit score
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
