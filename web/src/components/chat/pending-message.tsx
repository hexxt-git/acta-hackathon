import { motion } from 'motion/react';

export function PendingMessage() {
    return (
        <motion.div
            className="relative w-fit overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <p className="text-muted-foreground text-sm">Thinking...</p>
            <motion.div
                className="via-card/40 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
                initial={{ x: '-100%' }}
                animate={{
                    x: '100%',
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 1,
                }}
            />
        </motion.div>
    );
}
