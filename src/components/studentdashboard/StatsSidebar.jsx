import React, { useMemo, useEffect, useState } from "react";

const STORAGE_KEY_LEADERBOARD = "eduSphere_leaderboard_v1";

// Calculate points based on activity
function calcPointsForActivity(a) {
  let pts = 10; // base points for logging an activity
  const tags = (a.tags || []).map((t) => t.toLowerCase());

  if ((a.notes || "").length > 100) pts += 8;
  if ((a.attachments || []).length > 0) pts += 15;
  if (tags.includes("presenter")) pts += 20;

  return pts;
}

export default function StatsSidebar({ activities = [], user, batchId = "batch-1" }) {
  const [leaderboard, setLeaderboard] = useState([]);

  // Calculate my points
  const myPoints = useMemo(
    () => activities.reduce((sum, act) => sum + calcPointsForActivity(act), 0),
    [activities]
  );

  // Level system
  const levelInfo = useMemo(() => {
    const thresholds = [0, 50, 150, 350, 700];
    let level = 1;

    for (let i = 0; i < thresholds.length; i++) {
      if (myPoints >= thresholds[i]) level = i + 1;
    }

    const next = thresholds[level] || thresholds[thresholds.length - 1];
    const prev = thresholds[level - 1] || 0;
    const progress = Math.min(1, (myPoints - prev) / (next - prev));

    return { level, progress, next };
  }, [myPoints]);

  // Badge logic
  const badges = useMemo(() => {
    const earned = [];
    if (myPoints >= 10) earned.push("Rookie");
    if (myPoints >= 100) earned.push("Active Learner");
    if (activities.filter(a => (a.attachments || []).length > 0).length >= 5) earned.push("Cert Collector");
    if (activities.some(a => (a.tags || []).includes("presenter"))) earned.push("Speaker");
    return earned;
  }, [activities, myPoints]);

  // Load / Save leaderboard
  useEffect(() => {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADERBOARD) || "{}");

    if (!data[batchId]) data[batchId] = [];

    let batch = data[batchId];
    const idx = batch.findIndex((x) => x.id === user.id);

    if (idx === -1) {
      batch.push({ id: user.id, name: user.name, points: myPoints });
    } else {
      batch[idx].points = myPoints;
    }

    batch.sort((a, b) => b.points - a.points);
    data[batchId] = batch;

    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(data));
    setLeaderboard(batch.slice(0, 10));
  }, [myPoints, user, batchId]);

  return (
    <div className="space-y-4">
      {/* Progress Card */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold">Progress</h3>
            <p className="text-xs text-slate-500">Level {levelInfo.level}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{myPoints} pts</p>
            <p className="text-xs text-slate-400">Next: {levelInfo.next} pts</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-3 bg-blue-600 rounded-full"
              style={{ width: `${levelInfo.progress * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Progress to next level</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h4 className="text-sm font-semibold mb-2">Your Stats</h4>
        <div className="text-sm text-slate-600 space-y-1">
          <p>Activities: {activities.length}</p>
          <p>Certificates: {activities.filter(a => (a.attachments || []).length > 0).length}</p>
          <p>Presentations: {activities.filter(a => (a.tags || []).includes("presenter")).length}</p>
          <p>Last Logged: {activities.length ? new Date(activities[0].createdAt).toLocaleDateString() : "—"}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h4 className="text-sm font-semibold mb-2">Badges</h4>
        <div className="flex gap-2 flex-wrap">
          {badges.length === 0 ? (
            <p className="text-xs text-slate-500">No badges yet</p>
          ) : (
            badges.map((b) => (
              <span key={b} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs border">
                {b}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-4 bg-white border rounded-lg shadow-sm">
        <h4 className="text-sm font-semibold mb-2">Leaderboard</h4>
        <ol className="space-y-2">
          {leaderboard.map((user, i) => (
            <li
              key={user.id}
              className="flex justify-between items-center text-sm bg-slate-100 p-2 rounded"
            >
              <span>
                #{i + 1} — {user.name}
              </span>
              <span className="font-semibold">{user.points} pts</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Weekly Challenge */}
      <div className="p-4 bg-white border rounded-lg shadow-sm text-center">
        <p className="text-sm">Weekly Challenge:</p>
        <p className="text-sm font-medium">Attend 1 seminar</p>
        <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm">
          Join Challenge
        </button>
      </div>
    </div>
  );
}
