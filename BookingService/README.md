## Steps to setup the starter template

1. Clone the project

```
git clone https://github.com/singhsanket143/Express-Typescript-Starter-Project.git <ProjectName>
```

2. Move in to the folder structure

```
cd <ProjectName>
```

3. Install npm dependencies

```
npm i
```

4. Create a new .env file in the root directory and add the `PORT` env variable

```
echo PORT=3000 >> .env
```

5. Start the express server

```
npm run dev
```

### Webhook

#### What is a WebHook?

A WebHook is an API so that 3rd party Services can Communicate With Ur Application in Real - Time. It allows one service to send data to another service as soon as an event happens, without the need for the receiving service to continuously check for updates.


A **WebHook** is a way for one service to automatically notify another service when something important happens. Instead of constantly asking "Did something happen?", a WebHook lets the other service tell you the moment something occurs.

Think of it like a doorbell instead of constantly checking if someone is at your door.

#### How It Works

1. **You register a URL** with a service (e.g., payment service)
2. **Something happens** in that service (e.g., payment is completed)
3. **The service sends data** to your URL automatically via HTTP POST request
4. **Your server receives & processes** the data

#### Payment Service Example (Razorpay)

Your BookingService integrates with a payment gateway like Razorpay:

**Setup:**
- Your booking service registers this WebHook URL with Razorpay: `https://yourbookingapi.com/webhooks/payment`

**Flow:**
```
1. User initiates a booking and makes payment
2. Razorpay communicates with user's bank and deducts payment
3. Razorpay sends funds to your account
4. Razorpay automatically sends HTTP POST to your WebHook URL with payment details
5. Your BookingService webhook handler receives the data and:
   - Verifies the payment signature (security)
   - Updates booking status to "PAID"
   - Confirms the reservation
   - Sends confirmation email
   - Updates inventory
```

**Example WebHook Payload from Razorpay:**
```json
{
  "event": "payment.authorized",
  "payload": {
    "payment": {
      "entity": "payment",
      "id": "pay_123456",
      "amount": 50000,
      "currency": "INR",
      "status": "captured",
      "order_id": "order_booking_789"
    }
  }
}
```

#### Synchronous vs Asynchronous Communication

**Without WebHook (Synchronous - Bad UX):**
- User makes payment → Your app blocks and waits for payment response
- Your app continuously polls Razorpay: "Is payment confirmed yet?"
- User waits for long time → Poor user experience ❌

**With WebHook (Asynchronous - Good UX):**
- User makes payment → Your app returns response immediately
- User gets instant feedback: "Payment processing..." ✅
- Razorpay notifies your system in background via WebHook
- Your system updates booking status asynchronously
- User gets better experience ✅


#### Key Points to Remember

1. **WebHook = Automatic Notification**
   - Service tells you when something happens
   - You don't need to keep asking

2. **How to Use WebHook:**
   - Give payment service your app's URL
   - When payment happens, they send you a message
   - Your app receives and processes it

3. **Benefits:**
   - ✅ Customers get instant response
   - ✅ Better user experience
   - ✅ Updates happen in background
   - ✅ No delays or waiting

4. **In Your BookingService:**
   - Create a `/webhooks/payment` endpoint
   - Razorpay sends payment details to this URL
   - Update booking status to PAID
   - Send confirmation to customer

5. **Security:**
   - Always verify the message is really from Razorpay
   - Check the signature/token they send
   - Don't trust every message

#### Simple Flow Diagram

```
Customer Booking
     ↓
Customer Pays (Razorpay)
     ↓
Razorpay Gets Money
     ↓
Razorpay Sends Message → Your App WebHook
     ↓
Your App Updates Booking (PAID)
     ↓
Send Confirmation Email
     ↓
Customer Gets Confirmation ✅
```

#### Remember

WebHooks make your app **fast and responsive**. Your customers don't wait, everything happens automatically. That's why modern apps use WebHooks!