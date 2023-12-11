FROM rabbitmq:3.8-management-alpine

RUN wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/3.8.17/rabbitmq_delayed_message_exchange-3.8.17.8f537ac.ez && \
    mv rabbitmq_delayed_message_exchange-3.8.17.8f537ac.ez /opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange.ez

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange