'use client';

import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import umami from '@umami/node';

import {SubmissionApiPayload, SubmissionFilters} from '@/interfaces/Submission';

import {
  SubmissionFiltersContext,
  SubmissionsContext,
  TabContext,
  SubmissionsDateRangeContext,
  type SubmissionsDateRangeContextData,
  FocusedSubmissionIdContext,
  SidebarTab,
} from '../context';

import {DashboardHeader} from '../dashboard-header';
import {Noscript} from '../noscript';
import {Sidebar} from '../sidebar';
import {MapProps} from '../map';

import styles from './dashboard-page.module.scss';

interface DashboardPageProps {
  submissions: SubmissionApiPayload[];
}

const Map = dynamic<MapProps>(() => import('../map/Map'), {
  loading: () => <></>,
  ssr: false,
});

export function DashboardPage({submissions}: DashboardPageProps) {
  const [tab, setTab] = useState<SidebarTab>(SidebarTab.Data);

  const [filters, setFilters] = useState<SubmissionFilters>({
    dateRange: null,
    dateRangeInterval: null,
    parkingDuration: [],
    issue: null,
    day: null,
  });

  const [submissionsDateRange, setSubmissionsDateRange] =
    useState<SubmissionsDateRangeContextData>({
      first: null,
      last: null,
    });

  const [filteredSubmissions, setFilteredSubmissions] =
    useState<SubmissionApiPayload[]>(submissions);

  const [focusedSubmissionId, setFocusedSubmissionId] = useState<number | null>(
    null
  );

  // Filter submissions effect
  useEffect(() => {
    if (submissions.length === 0) return;

    const sortedSubmissions = [...submissions];

    sortedSubmissions.sort(
      (a, b) =>
        new Date(b.parking_time).getTime() - new Date(a.parking_time).getTime()
    );

    setSubmissionsDateRange({
      first: new Date(
        sortedSubmissions[sortedSubmissions.length - 1].parking_time
      ),
      last: new Date(sortedSubmissions[0].parking_time),
    });

    const {dateRange, parkingDuration, issue, day} = filters;

    setFilteredSubmissions(
      sortedSubmissions.filter(
        submission =>
          (dateRange
            ? new Date(submission.parking_time) >= dateRange.from &&
              new Date(submission.parking_time) <= dateRange.to
            : true) &&
          (parkingDuration.length > 0
            ? parkingDuration.includes(submission.parking_duration)
            : true) &&
          (issue ? submission.issues.includes(issue) : true) &&
          (day !== null
            ? new Date(submission.parking_time).getDay() === day
            : true)
      )
    );
  }, [submissions, filters]);

  useEffect(() => {
    if (focusedSubmissionId === null) return;

    umami.track('focus_submission', {submission_id: focusedSubmissionId});
  }, [focusedSubmissionId]);

  return (
    <SubmissionsDateRangeContext.Provider value={submissionsDateRange}>
      <SubmissionsContext.Provider value={filteredSubmissions}>
        <FocusedSubmissionIdContext.Provider
          value={{
            focus: focusedSubmissionId,
            setFocus: setFocusedSubmissionId,
          }}
        >
          <TabContext.Provider value={{tab, setTab}}>
            <SubmissionFiltersContext.Provider value={{filters, setFilters}}>
              <div className={styles.dashboardPage}>
                <DashboardHeader />
                <main className={styles.main}>
                  <Sidebar />
                  <Map submissions={filteredSubmissions} />
                </main>
                <Noscript />
              </div>
            </SubmissionFiltersContext.Provider>
          </TabContext.Provider>
        </FocusedSubmissionIdContext.Provider>
      </SubmissionsContext.Provider>
    </SubmissionsDateRangeContext.Provider>
  );
}
