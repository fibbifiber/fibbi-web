import { useRef } from 'react';
import { useReveals } from '../lib/useReveals';
import Icon from '../components/Icon';

export default function Policies() {
  const ref = useRef(null);
  useReveals(ref);
  return (
    <div className="page active" ref={ref}>
      <section>
        <div className="wrap">
          <span className="kicker lime">the boring-but-important page <Icon name="clipboard" size="1em" /></span>
          <h1 className="sec-title">Shipping, returns &amp; everything else.</h1>
          <p className="lead">Short versions below. If anything's unclear, WhatsApp us — a human replies, usually within the hour (10am–7pm IST).</p>
          <div className="policy-grid">
            <div className="policy-card reveal">
              <h4><Icon name="truck" size="1em" /> Shipping</h4>
              <ul>
                <li>Pan-India delivery to most serviceable pincodes via trusted national courier partners.</li>
                <li>Dispatch within 24–48 hours of order confirmation.</li>
                <li>Metros: 2–4 business days · Rest of India: 4–7 business days.</li>
                <li>Free shipping on orders ₹499+. Below that, ₹49 flat.</li>
                <li>COD available pan-India (+₹49 handling).</li>
              </ul>
            </div>
            <div className="policy-card reveal" data-delay="1">
              <h4><Icon name="return" size="1em" /> Returns &amp; replacements</h4>
              <ul>
                <li>Damaged, defective, or wrong item? Photos within 48 hours of delivery → free replacement or full refund.</li>
                <li>Being a food product, opened pouches can't be returned (food-safety norms).</li>
                <li>Refunds hit your original payment method in 5–7 business days.</li>
              </ul>
            </div>
            <div className="policy-card reveal">
              <h4><Icon name="card" size="1em" /> Payments</h4>
              <ul>
                <li>UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay, Amex), netbanking, and COD.</li>
                <li>Processed over an encrypted connection. We never see or store your card details.</li>
                <li>Order confirmation and invoice emailed with every order.</li>
              </ul>
            </div>
            <div className="policy-card reveal" data-delay="1">
              <h4><Icon name="headset" size="1em" /> Contact &amp; grievances</h4>
              <ul>
                <li>Email: fibbi.fiber@gmail.com · WhatsApp: +91 9467582433 (10am–7pm IST, Mon–Sat).</li>
                <li>We are based in Pune, Maharashtra.</li>
                <li>Every complaint gets a human reply within 48 working hours.</li>
                <li>Disclaimer: psyllium is a food, not a medicine. No disease claims, ever.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
