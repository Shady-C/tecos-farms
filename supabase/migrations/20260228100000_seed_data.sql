-- ============================================================
-- Seed: default settings + 200 sample orders (relational schema)
-- ============================================================

-- Default settings
INSERT INTO settings (price_per_kg, min_kg, order_cutoff_day, order_cutoff_time, delivery_day, enabled_payment_methods)
VALUES (12000, 1, 'wednesday', '23:59:00', 'saturday', '["cash","mobile_money"]'::jsonb);

-- 200 sample orders across 4 weeks of February 2026
DO $$
DECLARE
  first_names text[] := ARRAY[
    'Juma','Amina','Baraka','Neema','Hassan','Fatma','Rashid','Zainab',
    'Daudi','Halima','Musa','Rehema','Ibrahim','Mariam','Salim','Aisha',
    'Hamisi','Saida','Omari','Hadija','Bakari','Mwanaisha','Yusuf','Grace',
    'John','Esther','Joseph','Rose','Peter','Agnes','Michael','Joyce',
    'Daniel','Dorcas','Emmanuel','Witness','Patrick','Mercy','Charles','Janet'
  ];
  last_names text[] := ARRAY[
    'Mwanza','Kimaro','Massawe','Mushi','Lyimo','Mchome','Shirima','Mfinanga',
    'Makundi','Swai','Njau','Kisaka','Temba','Kapinga','Ngowi','Mbise',
    'Urassa','Laizer','Minja','Maro','Shayo','Msuya','Tarimo','Mwita',
    'Chacha','Sanga','Mwakasege','Kalinga','Mhina','Mosha','Kimambo','Mlay',
    'Macha','Nkya','Kaaya','Ringo','Komba','Magesa','Silayo','Mwanga'
  ];
  street_addresses text[] := ARRAY[
    'Mikocheni, Dar es Salaam',
    'Sinza, Dar es Salaam',
    'Mwenge, Dar es Salaam',
    'Kariakoo, Dar es Salaam',
    'Buguruni, Dar es Salaam',
    'Mbagala, Dar es Salaam',
    'Tandika, Dar es Salaam',
    'Kimara, Dar es Salaam',
    'Kwembe, Dar es Salaam',
    'Manzese, Dar es Salaam',
    'Tegeta, Dar es Salaam',
    'Kigamboni, Dar es Salaam',
    'Tabata, Dar es Salaam',
    'Ukonga, Dar es Salaam',
    'Kijitonyama, Dar es Salaam',
    'Magomeni, Dar es Salaam'
  ];
  landmarks text[] := ARRAY[
    'Near Mlimani City',
    'Behind Kariakoo Market',
    'Opposite Shoppers Plaza',
    'Near Ubungo Bus Terminal',
    'Near Mikocheni Mall',
    'Behind Sinza Mosque',
    'Near Mwenge Carvers Market',
    'Opposite Muhimbili Hospital',
    'Near Tegeta Fish Market',
    'Behind Mbagala Rangi Tatu',
    'Next to Tabata Dampo',
    'Near Kimara Baruti',
    'Opposite Posta Ilala',
    'Near Kigamboni Ferry',
    'Behind Manzese Market',
    'Near Kwembe Junction'
  ];
  notes_pool text[] := ARRAY[
    'Lete asubuhi mapema','Naomba kukata vipande vidogo','Piga simu kabla ya kuja',
    'Weka kwenye mfuko wa barafu','Order ya kila wiki','Tafadhali fika kabla saa 4',
    'Extra lean cuts please','For restaurant order','Deliver to gate only',
    'Call before delivery','Regular weekly customer','Need receipt please'
  ];
  email_domains text[] := ARRAY['gmail.com','yahoo.com','hotmail.com','outlook.com'];
  phone_prefixes text[] := ARRAY['71','74','75','76','77','78'];

  week_starts date[] := ARRAY['2026-02-01'::date,'2026-02-08'::date,'2026-02-15'::date,'2026-02-22'::date];
  batches      date[] := ARRAY['2026-02-07'::date,'2026-02-14'::date,'2026-02-21'::date,'2026-02-28'::date];
  orders_per_week int[] := ARRAY[48,52,50,50];

  v_week        int;
  v_i           int;
  v_fname       text;
  v_lname       text;
  v_name        text;
  v_phone       text;
  v_email       text;
  v_street      text;
  v_addr2       text;
  v_landmark    text;
  v_kilos       numeric;
  v_total       numeric;
  v_pay_method  payment_method;
  v_pay_status  payment_status;
  v_ord_status  order_status;
  v_batch       date;
  v_notes       text;
  v_created     timestamptz;
  v_rand        float;
  v_rand2       float;
  v_day_offset  int;
  v_hour        int;
  v_minute      int;
  v_customer_id uuid;
  v_address_id  uuid;
BEGIN
  FOR v_week IN 1..4 LOOP
    FOR v_i IN 1..orders_per_week[v_week] LOOP

      v_fname := first_names[1 + floor(random() * array_length(first_names, 1))::int];
      v_lname := last_names[1 + floor(random() * array_length(last_names, 1))::int];
      v_name  := v_fname || ' ' || v_lname;

      -- Unique phone per order for seed data; suffix by week+index to avoid collisions
      v_phone := '+255' || phone_prefixes[1 + floor(random() * array_length(phone_prefixes, 1))::int]
                 || lpad(((v_week * 100 + v_i) * 1000 + floor(random() * 1000)::int)::text, 7, '0');

      IF random() < 0.2 THEN
        v_email := lower(v_fname) || '.' || lower(v_lname)
                   || floor(random() * 99)::text || '@'
                   || email_domains[1 + floor(random() * array_length(email_domains, 1))::int];
      ELSE
        v_email := NULL;
      END IF;

      v_street := street_addresses[1 + floor(random() * array_length(street_addresses, 1))::int];

      IF random() < 0.4 THEN
        v_addr2    := 'Plot ' || (1 + floor(random() * 500)::int)::text || ', Block ' || chr(65 + floor(random() * 8)::int);
        v_landmark := landmarks[1 + floor(random() * array_length(landmarks, 1))::int];
      ELSE
        v_addr2    := NULL;
        v_landmark := NULL;
      END IF;

      v_rand := random();
      IF v_rand < 0.7 THEN
        v_kilos := round((2 + random() * 8)::numeric, 1);
      ELSIF v_rand < 0.9 THEN
        v_kilos := round((10 + random() * 10)::numeric, 1);
      ELSE
        v_kilos := round((1 + random())::numeric, 1);
      END IF;

      v_total := round(v_kilos * 12000);

      v_rand := random();
      IF v_rand < 0.6 THEN
        v_pay_method := 'cash';
      ELSIF v_rand < 0.9 THEN
        v_pay_method := 'mobile_money';
      ELSE
        v_pay_method := NULL;
      END IF;

      v_rand2 := random();
      IF v_week = 1 THEN
        IF v_rand2 < 0.7 THEN v_pay_status := 'paid';
        ELSIF v_pay_method = 'mobile_money' THEN v_pay_status := 'prepaid';
        ELSE v_pay_status := 'unpaid';
        END IF;
      ELSIF v_week = 2 THEN
        IF v_rand2 < 0.5 THEN v_pay_status := 'paid';
        ELSIF v_pay_method = 'mobile_money' AND v_rand2 < 0.7 THEN v_pay_status := 'prepaid';
        ELSE v_pay_status := 'unpaid';
        END IF;
      ELSIF v_week = 3 THEN
        IF v_rand2 < 0.25 THEN v_pay_status := 'paid';
        ELSIF v_pay_method = 'mobile_money' AND v_rand2 < 0.5 THEN v_pay_status := 'prepaid';
        ELSE v_pay_status := 'unpaid';
        END IF;
      ELSE
        IF v_pay_method = 'mobile_money' AND v_rand2 < 0.4 THEN v_pay_status := 'prepaid';
        ELSE v_pay_status := 'unpaid';
        END IF;
      END IF;

      v_rand := random();
      IF v_week = 1 THEN
        IF v_rand < 0.85 THEN v_ord_status := 'delivered';
        ELSE v_ord_status := 'confirmed';
        END IF;
      ELSIF v_week = 2 THEN
        IF v_rand < 0.5 THEN v_ord_status := 'delivered';
        ELSIF v_rand < 0.85 THEN v_ord_status := 'confirmed';
        ELSE v_ord_status := 'pending';
        END IF;
      ELSIF v_week = 3 THEN
        IF v_rand < 0.2 THEN v_ord_status := 'delivered';
        ELSIF v_rand < 0.6 THEN v_ord_status := 'confirmed';
        ELSE v_ord_status := 'pending';
        END IF;
      ELSE
        IF v_rand < 0.1 THEN v_ord_status := 'confirmed';
        ELSE v_ord_status := 'pending';
        END IF;
      END IF;

      v_batch := batches[v_week];

      v_day_offset := floor(random() * 4)::int;
      v_hour       := 7 + floor(random() * 15)::int;
      v_minute     := floor(random() * 60)::int;
      v_created    := (week_starts[v_week] + v_day_offset * interval '1 day'
                       + v_hour * interval '1 hour'
                       + v_minute * interval '1 minute')::timestamptz;

      IF random() < 0.15 THEN
        v_notes := notes_pool[1 + floor(random() * array_length(notes_pool, 1))::int];
      ELSE
        v_notes := NULL;
      END IF;

      -- Upsert customer
      INSERT INTO customers (name, phone, email)
      VALUES (v_name, v_phone, v_email)
      ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name
      RETURNING id INTO v_customer_id;

      -- Insert address
      INSERT INTO addresses (customer_id, street_address, address_line_2, landmark, is_default)
      VALUES (v_customer_id, v_street, v_addr2, v_landmark, true)
      RETURNING id INTO v_address_id;

      -- Insert order
      INSERT INTO orders (
        customer_id, address_id,
        kilos, price_per_kg, total_price,
        payment_method, payment_status, order_status,
        delivery_date, notes, created_at
      ) VALUES (
        v_customer_id, v_address_id,
        v_kilos, 12000, v_total,
        v_pay_method, v_pay_status, v_ord_status,
        v_batch, v_notes, v_created
      );

    END LOOP;
  END LOOP;
END $$;
