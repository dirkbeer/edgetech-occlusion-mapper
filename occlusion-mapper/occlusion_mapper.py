import os
import json
import schedule
import logging
from time import sleep
from typing import Any, Tuple
from datetime import datetime
from flask import Flask, request, jsonify
from threading import Thread

from base_mqtt_pub_sub import BaseMQTTPubSub


# inherit functionality from BaseMQTTPubSub parent this way
class OcclusionMapper(BaseMQTTPubSub):
    def __init__(
        self: Any,
        manual_control_topic: str,
        **kwargs: Any,
    ):
        # Pass environment variables as parameters (include **kwargs) in super().__init__()
        super().__init__(**kwargs)
        self.manual_control_topic = manual_control_topic

        self.app = Flask(__name__)
        self.app.add_url_rule("/camera-point", "camera-point", self._camera_callback)  # Add this line
        #self.app.run(host="0.0.0.0", debug=True, port=5000)

        # Connect client in constructor
        self.connect_client()
        sleep(1)
        self.publish_registration("Occlusion Mapper Module Registration")
        logging.info("Occlusion Mapper Module Started")

    def _camera_callback(self: Any) -> Tuple[str, int]:
        pan = float(request.args.get("pan"))
        tilt = float(request.args.get("tilt"))
        zoom = float(request.args.get("zoom"))
        logging.info(f"Camera Point request tilt: {tilt}, pan: {pan}, zoom: {zoom}")
        if pan is None or tilt is None or zoom is None:
            return jsonify({"error": "Pan, tilt, and zoom parameters required"}), 400

        data = {"pan": pan, "tilt": tilt, "zoom": zoom}

        payload_json = self.generate_payload_json(
            push_timestamp=int(datetime.utcnow().timestamp()),
            device_type="TBC",
            id_="TBC",
            deployment_id="TBC",
            current_location="TBC",
            status="Debug",
            message_type="Event",
            model_version="null",
            firmware_version="v0.0.0",
            data_payload_type="Manual Control",
            data_payload=json.dumps(data),
        )

        logging.info(f"Camera Point request sent to {self.manual_control_topic}")
        logging.info(f"Camera Point request sent with payload: {payload_json}")
        self.publish_to_topic(self.manual_control_topic, payload_json)
        # Do something with pan and tilt parameters
        return jsonify({"pan": pan, "tilt": tilt, "zoom": zoom}), 200

    def main(self: Any) -> None:
        # main function wraps functionality and always includes a while True
        # (make sure to include a sleep)

        # include schedule heartbeat in every main()
        schedule.every(10).seconds.do(
            self.publish_heartbeat, payload="Occlusion Mapper Module Heartbeat"
        )

        frontend_thread = Thread(target=self.app.run, kwargs={"host":"0.0.0.0", "port":5000, "debug":False})
        frontend_thread.start()

        while True:
            try:
                # run heartbeat and anything else scheduled if clock is up
                schedule.run_pending()
                # include a sleep so loop does not run at CPU time
                sleep(0.001)

            except Exception as e:
                if self.debug:
                    print(e)


if __name__ == "__main__":
    # instantiate an instance of the class
    # any variables in BaseMQTTPubSub can be overridden using **kwargs
    # and environment variables should be in the docker compose (in a .env file)
    template = OcclusionMapper(
        manual_control_topic=str(os.environ.get("MANUAL_CONTROL_TOPIC")),
        mqtt_ip=str(os.environ.get("MQTT_IP")),
    )
    # call the main function
    template.main()
