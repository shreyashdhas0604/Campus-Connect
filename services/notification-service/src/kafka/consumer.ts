import { consumer, connectConsumer } from "./kafkaConfig";
import { sendOtpEmail } from "../services/OtpEmailService";

export const runConsumer = async () => {
  await connectConsumer();

  await consumer.subscribe({ topics : [
    "Kafka-service-started",
    "user-otp-requested"
  ] , fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Received message from topic ${topic}:`,
        message.value?.toString()
      );

      if(topic === "user-otp-requested"){
        const payload = JSON.parse(message.value?.toString() || "{}");
        const { userId, otp,email } = payload;
        if(email){
          await sendOtpEmail(email,otp);
          console.log(`Otp sent to ${email}`);
        }
        else{
          console.error(`Email not found for userId ${userId}`);
        }
      }
    },
  });
};

// runConsumer();
