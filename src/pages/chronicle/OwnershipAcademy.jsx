import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, ChevronRight, Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "../../components/shared/SectionHeader";
import LockedOverlay from "../../components/shared/LockedOverlay";
import { useUserTier } from "../../hooks/useUserTier";

export default function OwnershipAcademy() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const { userTier, loading: tierLoading } = useUserTier();

  const { data: courses = [] } = useQuery({
    queryKey: ["academyCourses"],
    queryFn: () => base44.entities.AcademyCourse.list(),
    initialData: [],
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["academyLessons"],
    queryFn: () => base44.entities.AcademyLesson.list(),
    initialData: [],
  });

  const { data: worksheets = [] } = useQuery({
    queryKey: ["worksheets"],
    queryFn: () => base44.entities.AcademyWorksheet.list(),
    initialData: [],
  });

  const courseLessons = selectedCourse
    ? lessons
        .filter((l) => l.courseId === selectedCourse.id)
        .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
    : [];

  const currentLesson = selectedLesson
    ? lessons.find((l) => l.id === selectedLesson.id)
    : null;

  const lessonWorksheets = currentLesson
    ? worksheets.filter((w) => w.lessonId === currentLesson.id)
    : [];

  const handleMarkComplete = async () => {
    if (currentLesson) {
      setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));
      try {
        await base44.entities.AcademyProgress.create({
          lessonId: currentLesson.id,
          completed: true,
          completedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error marking lesson complete:", error);
      }
    }
  };

  if (selectedLesson && currentLesson) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLesson(null)}
            className="text-muted-foreground"
          >
            ← Back to Course
          </Button>
          <div>
            <p className="text-[10px] font-heading tracking-widest text-primary uppercase mb-1">
              {currentLesson.courseId}
            </p>
            <h1 className="font-heading text-3xl font-bold">{currentLesson.title}</h1>
            {currentLesson.subtitle && (
              <p className="text-muted-foreground mt-1">{currentLesson.subtitle}</p>
            )}
          </div>
        </div>

        {/* Barry's Perspective */}
        {currentLesson.barryLesson && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-sm bg-gradient-to-r from-primary/10 via-crimson/5 to-transparent border border-primary/20 p-6"
          >
            <p className="font-heading text-[10px] tracking-widest text-primary uppercase mb-3">
              Barry Parker Speaks
            </p>
            <p className="font-prose text-lg italic text-foreground leading-relaxed">
              "{currentLesson.barryLesson}"
            </p>
          </motion.div>
        )}

        {/* Lesson Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <div
            className="font-prose text-base text-muted-foreground leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: currentLesson.lessonBody.replace(/\n/g, "<br/>"),
            }}
          />
        </motion.div>

        {/* Key Takeaways */}
        {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
          <div className="space-y-3">
            <p className="font-heading text-[10px] tracking-widest text-primary uppercase">
              Key Takeaways
            </p>
            <div className="grid gap-2">
              {currentLesson.keyTakeaways.map((takeaway, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3 p-3 rounded-sm bg-card border border-border/50"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-sm text-foreground">{takeaway}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Steps */}
        {currentLesson.actionSteps && currentLesson.actionSteps.length > 0 && (
          <div className="space-y-3">
            <p className="font-heading text-[10px] tracking-widest text-primary uppercase">
              Action Steps
            </p>
            <div className="grid gap-2">
              {currentLesson.actionSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3 p-3 rounded-sm bg-secondary/30 border border-border/30"
                >
                  <span className="font-heading text-sm text-primary font-bold">
                    {idx + 1}.
                  </span>
                  <p className="text-sm text-foreground">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Worksheets */}
        {lessonWorksheets.length > 0 && (
          <div className="space-y-3">
            <p className="font-heading text-[10px] tracking-widest text-primary uppercase">
              Worksheets
            </p>
            <div className="grid gap-2">
              {lessonWorksheets.map((ws) => (
                <div
                  key={ws.id}
                  className="flex items-center justify-between p-4 rounded-sm bg-card border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div>
                    <p className="font-heading text-sm font-semibold">{ws.title}</p>
                    <p className="text-[12px] text-muted-foreground mt-1">
                      {ws.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mark Complete Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleMarkComplete}
            className={`gap-2 ${
              completedLessons.has(currentLesson.id)
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {completedLessons.has(currentLesson.id) ? "Completed" : "Mark Complete"}
          </Button>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCourse(null)}
            className="text-muted-foreground"
          >
            ← Back to Academy
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-bold">{selectedCourse.title}</h1>
            {selectedCourse.subtitle && (
              <p className="text-muted-foreground mt-1">{selectedCourse.subtitle}</p>
            )}
          </div>
        </div>

        {selectedCourse.description && (
          <p className="font-prose text-base text-muted-foreground leading-relaxed">
            {selectedCourse.description}
          </p>
        )}

        <div className="grid gap-3">
          {courseLessons.map((lesson, idx) => (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedLesson(lesson)}
              className="group flex items-center gap-4 p-4 rounded-sm border bg-card/50 border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all text-left"
            >
              <div
                className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${
                  completedLessons.has(lesson.id)
                    ? "bg-emerald-600/20 text-emerald-500"
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                }`}
              >
                {completedLessons.has(lesson.id) ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-semibold">{lesson.title}</p>
                {lesson.subtitle && (
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    {lesson.subtitle}
                  </p>
                )}
                {lesson.estimatedTime && (
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.estimatedTime}
                  </p>
                )}
              </div>
              {lesson.isPremium && (
                <Lock className="w-4 h-4 text-primary/60" />
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <LockedOverlay
        requiredTier={{ tierLevel: 2, name: "Inner Circle", feature: "Ownership Academy courses" }}
        userTier={userTier}
      >
      <SectionHeader
        eyebrow="The Doctrine Behind the Hustle"
        title="Barry Parker's Ownership Academy"
        subtitle="Where the story turns into strategy. Learn music law, publishing, contracts, real estate, and the 7 principles of ownership."
      />

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-sm border border-amber-500/30 bg-amber-500/5 p-4"
      >
        <p className="font-heading text-[10px] tracking-widest text-amber-600 uppercase mb-2">
          Educational Disclaimer
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The Ownership Academy is for educational purposes only and does not provide legal,
          financial, tax, or investment advice. Users should consult qualified professionals
          before making legal, financial, business, or investment decisions.
        </p>
      </motion.div>

      {/* Courses Grid */}
      <div className="grid gap-4">
        {courses
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
          .map((course, idx) => (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedCourse(course)}
              className="group relative overflow-hidden rounded-sm border border-border/50 bg-gradient-to-br from-card via-secondary/30 to-card p-6 hover:border-primary/30 transition-all text-left"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-heading text-[10px] tracking-widest text-primary uppercase mb-2">
                      Course {course.orderNumber}
                    </p>
                    <h3 className="font-heading text-xl font-bold">{course.title}</h3>
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.subtitle}
                      </p>
                    )}
                  </div>
                  {course.isPremium && (
                    <Lock className="w-5 h-5 text-primary/60 mt-1" />
                  )}
                </div>

                {course.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {course.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                  {course.estimatedTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.estimatedTime}
                    </span>
                  )}
                  <span className="capitalize">{course.difficultyLevel}</span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            </motion.button>
          ))}
      </div>
      </LockedOverlay>
    </div>
  );
}