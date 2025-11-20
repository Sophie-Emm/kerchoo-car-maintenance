Predictive scheduling (all types) Code: 
WITH last_events AS (
  SELECT DISTINCT ON (type_id) type_id, event_miles, event_at
  FROM maintenance_events
  WHERE vehicle_id = $1
  ORDER BY type_id, event_at DESC
),
rules AS (
  SELECT mt.id AS type_id,
         COALESCE(mr.interval_miles, mt.default_interval_miles) AS interval_miles,
         COALESCE(mr.interval_days,  mt.default_interval_days)  AS interval_days,
         mt.name
  FROM maintenance_types mt
  LEFT JOIN maintenance_rules mr ON mr.vehicle_id = $1 AND mr.type_id = mt.id
),
latest_odo AS (
  SELECT reading_mi, reading_at
  FROM odometer_readings
  WHERE vehicle_id = $1
  ORDER BY reading_at DESC
  LIMIT 1
)
SELECT
  r.name AS maintenance_type,
  le.event_miles, le.event_at,
  r.interval_miles, r.interval_days,
  (le.event_miles + r.interval_miles) AS next_due_miles,
  (le.event_at + (r.interval_days || ' days')::INTERVAL)::DATE AS next_due_date,
  (lo.reading_mi - (le.event_miles + r.interval_miles)) AS miles_over_or_to_go,
  (CURRENT_DATE - (le.event_at + (r.interval_days || ' days')::INTERVAL)) AS days_over_or_to_go
FROM rules r
LEFT JOIN last_events le USING (type_id)
CROSS JOIN latest_odo lo
ORDER BY r.name;