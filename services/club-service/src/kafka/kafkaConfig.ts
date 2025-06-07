import { Kafka, Consumer, Producer } from 'kafkajs';
import { handleMessage } from './messageHandler';

export const kafka = new Kafka({
    clientId: 'club-service',
    brokers: [process.env.KAFKA_BROKER_URL || 'kafka:9092']
});

export const producer: Producer = kafka.producer();
export const consumer: Consumer = kafka.consumer({ groupId: 'club-service-group' });

export const connectProducer = async () => {
    await producer.connect();
    console.log("Kafka Producer connected");
};

export const connectConsumer = async () => {
    await consumer.connect();
    console.log("Kafka Consumer connected");
};

export const runConsumer = async () => {
    try {
        // Subscribe to relevant topics
        await consumer.subscribe({ 
            topics: [
                'club-events',
                'membership-events',
                'activity-events'
            ], 
            fromBeginning: true 
        });
        
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value) {
                    const messageValue = message.value.toString();
                    await handleMessage(topic, JSON.parse(messageValue));
                }
            },
        });
        
        console.log("Kafka Consumer is running and subscribed to topics");
    } catch (error) {
        console.error("Error running Kafka consumer:", error);
        throw error;
    }
};
