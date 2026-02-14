-- PAYMENT & REFUND MANAGEMENT

-- 1. Process Secure Payment
CREATE OR REPLACE FUNCTION process_payment_secure(
    p_booking_ids INT[],
    p_customer_id INT,
    p_paid_amount DECIMAL,     
    p_method VARCHAR
) RETURNS JSON AS $$
DECLARE
    v_total_fare DECIMAL := 0;
    v_valid_count INT := 0;
    v_seat_fare DECIMAL;
    v_b_id INT;
    v_payment_id INT;
BEGIN
    SELECT SUM(t.BaseFare), COUNT(b.BookingID)
    INTO v_total_fare, v_valid_count
    FROM BOOKING b
    JOIN TRIP t ON b.TripID = t.TripID
    WHERE b.BookingID = ANY(p_booking_ids) 
      AND b.CustomerID = p_customer_id
      AND b.BookingStatus = 'Pending';

    IF v_valid_count <> array_length(p_booking_ids, 1) THEN
        RETURN json_build_object('success', false, 'message', 'Invalid bookings selected');
    END IF;

    IF p_paid_amount < v_total_fare THEN
        RETURN json_build_object('success', false, 'message', 'Insufficient amount');
    END IF;

    FOREACH v_b_id IN ARRAY p_booking_ids LOOP
        SELECT t.BaseFare INTO v_seat_fare 
        FROM BOOKING b JOIN TRIP t ON b.TripID = t.TripID 
        WHERE b.BookingID = v_b_id;

        INSERT INTO PAYMENT (BookingID, Amount, PaymentMethod, PaymentStatus)
        VALUES (v_b_id, v_seat_fare, p_method, 'Completed')
        RETURNING PaymentID INTO v_payment_id;

        UPDATE BOOKING 
        SET BookingStatus = 'Confirmed', PaymentID = v_payment_id 
        WHERE BookingID = v_b_id;  
    END LOOP;

    RETURN json_build_object(
        'success', true, 
        'message', 'Payment successful for ' || v_valid_count || ' seats individually.'
    );
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger Function: Auto-create Refund request
CREATE OR REPLACE FUNCTION trigger_create_refund_request()
RETURNS TRIGGER AS $$
DECLARE
    v_payment_id INT;
    v_amount DECIMAL;
BEGIN
    IF NEW.BookingStatus = 'RefundRequested' AND OLD.BookingStatus <> 'RefundRequested' THEN
        SELECT PaymentID, Amount INTO v_payment_id, v_amount
        FROM PAYMENT
        WHERE BookingID = NEW.BookingID
        LIMIT 1;

        IF v_payment_id IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM REFUND WHERE BookingID = NEW.BookingID AND Status = 'Pending') THEN
                INSERT INTO REFUND (PaymentID, BookingID, RefundAmount, Status)
                VALUES (v_payment_id, NEW.BookingID, v_amount, 'Pending');
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_booking_refund_request ON BOOKING;
CREATE TRIGGER trg_after_booking_refund_request
AFTER UPDATE ON BOOKING
FOR EACH ROW
EXECUTE FUNCTION trigger_create_refund_request();

-- 3. View: Operator Refund Requests
CREATE OR REPLACE VIEW v_operator_refunds AS
SELECT 
    r.RefundID as refundid,
    r.BookingID as bookingid,
    c.FullName as customername,
    rt.StartPoint as startpoint,
    rt.EndPoint as endpoint,
    t.TripDate as tripdate,
    t.DepartureTime as departuretime,
    s.SeatNumber as seatnumber,
    r.RefundAmount as amount,
    r.Status as refundstatus,
    r.CreatedAt as requestedat,
    t.OperatorID as operatorid,
    comp.IssueType as issuetype,
    comp.Description as reason
FROM REFUND r
JOIN BOOKING b ON r.BookingID = b.BookingID
JOIN CUSTOMER c ON b.CustomerID = c.CustomerID
JOIN TRIP t ON b.TripID = t.TripID
JOIN ROUTE rt ON t.RouteID = rt.RouteID
JOIN SEAT s ON b.SeatID = s.SeatID
LEFT JOIN COMPLAINT comp ON b.BookingID = comp.BookingID;



