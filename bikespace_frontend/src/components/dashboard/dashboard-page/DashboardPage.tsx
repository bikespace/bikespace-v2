import React, {useState, useEffect} from 'react';

import {SubmissionApiPayload, SubmissionFilters} from '@/interfaces/Submission';

import {SubmissionFiltersContext, TabContext} from '../context';

import {DashboardHeader} from '../dashboard-header';
import {Map} from '../map';
import {Noscript} from '../noscript';
import {Sidebar} from '../sidebar';

import * as styles from './dashboard-page.module.scss';

interface DashboardPageProps {
  submissions: SubmissionApiPayload[];
}

export function DashboardPage({submissions}: DashboardPageProps) {
  const [tab, setTab] = useState<string>('data');
  const [filters, setFilters] = useState<SubmissionFilters | null>(null);
  const [filteredSubmissions, setFilteredSubmissions] =
    useState<SubmissionApiPayload[]>(submissions);

  useEffect(() => {
    if (!filters) return setFilteredSubmissions(submissions);

    const {dateRange, parkingDuration} = filters;

    if (dateRange && parkingDuration)
      return setFilteredSubmissions(
        submissions
          .filter(
            submission =>
              new Date(submission.parking_time) >= dateRange.from &&
              new Date(submission.parking_time) <= dateRange.to
          )
          .filter(submission => submission.parking_duration === parkingDuration)
      );

    if (dateRange)
      return setFilteredSubmissions(
        submissions.filter(
          submission =>
            new Date(submission.parking_time) >= dateRange.from &&
            new Date(submission.parking_time) <= dateRange.to
        )
      );

    if (parkingDuration)
      return setFilteredSubmissions(
        submissions.filter(
          submission => submission.parking_duration === parkingDuration
        )
      );
  }, [submissions, filters]);

  return (
    <TabContext.Provider value={{tab, setTab}}>
      <SubmissionFiltersContext.Provider value={{filters, setFilters}}>
        <div className={styles.dashboardPage}>
          <DashboardHeader />
          <main className={styles.main}>
            <Sidebar submissions={filteredSubmissions} />
            <Map submissions={filteredSubmissions} />
          </main>
          <Noscript />
        </div>
      </SubmissionFiltersContext.Provider>
    </TabContext.Provider>
  );
}
