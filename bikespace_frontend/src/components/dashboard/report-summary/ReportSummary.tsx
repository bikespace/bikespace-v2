import React, {useState, useEffect} from 'react';
import {DateTime} from 'luxon';

import {useSubmissionsStore} from '@/store';

import {useAllSubmissionsDateRange, useSubmissionsQuery} from '@/hooks';

import warningIcon from '@/assets/icons/exclamation-triangle.svg';

import styles from './report-summary.module.scss';

export function ReportSummary() {
  const {isPending} = useSubmissionsQuery();

  const {submissions, filters} = useSubmissionsStore(state => ({
    submissions: state.submissions,
    filters: state.filters,
  }));

  const {first, last} = useAllSubmissionsDateRange();

  const [dateRange, setDateRange] = useState({
    from: first!,
    to: last!,
  });

  useEffect(() => {
    if (submissions.length === 0) return;

    setDateRange({
      from: new Date(submissions[0].parking_time),
      to: new Date(submissions[submissions.length - 1].parking_time),
    });
  }, [submissions]);

  const earliestEntry = DateTime.fromJSDate(dateRange.from).toLocaleString(
    DateTime.DATE_FULL,
    {locale: 'en-CA'}
  );
  const latestEntry = DateTime.fromJSDate(dateRange.to).toLocaleString(
    DateTime.DATE_FULL,
    {locale: 'en-CA'}
  );

  return (
    <div className={styles.summary}>
      <div>
        {isPending ? (
          <span className={styles.entryCount}>Loading Reports...</span>
        ) : submissions.length > 0 ? (
          <span className={styles.entryCount}>
            {submissions.length.toLocaleString('en-CA')}
          </span>
        ) : (
          <img
            className={styles.warningIcon}
            src={warningIcon.src}
            alt="warning icon"
          />
        )}
        <span>
          {isPending
            ? ''
            : submissions.length > 0
              ? ` reports ${
                  filters.dateRange === null &&
                  filters.dateRangeInterval === null &&
                  filters.issue === null &&
                  filters.parkingDuration.length === 0 &&
                  filters.day === null
                    ? ''
                    : ' (filtered)'
                }`
              : 'No reports match filter criteria'}
        </span>
      </div>
      <div>
        {isPending
          ? ''
          : submissions.length > 0
            ? `${earliestEntry} - ${latestEntry}`
            : 'Date Range N/A'}
      </div>
    </div>
  );
}
