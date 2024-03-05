import os
import json
import schedule
import logging
from time import sleep
from typing import Any, Tuple
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from threading import Thread

from base_mqtt_pub_sub import BaseMQTTPubSub


# inherit functionality from BaseMQTTPubSub parent this way
class OcclusionMapper(BaseMQTTPubSub):
    def __init__(
        self: Any,
        manual_control_topic: str,
        mapping_filepath: str,
        camera_ip: str,
        **kwargs: Any,
    ):
        # Pass environment variables as parameters (include **kwargs) in super().__init__()
        super().__init__(**kwargs)
        self.manual_control_topic = manual_control_topic
        self.mapping_filepath = mapping_filepath
        self.camera_ip = camera_ip

        self.app = Flask(__name__)
        CORS(self.app)  # Add this line to enable CORS
        self.app.add_url_rule(
            "/camera-point", "camera-point", self._camera_callback
        )  # Add this line
        self.app.add_url_rule(
            "/save-mapping",
            "save-mapping",
            self._save_mapping_callback,
            methods=["POST"],
        )  # Add this line

        @self.app.route("/camera.js")
        def hello_world():
            return f'var camera_ip = "{self.camera_ip}";'

        # self.app.run(host="0.0.0.0", debug=True, port=5000)

        # Connect client in constructor
        self.connect_client()
        sleep(1)
        self.publish_registration("Occlusion Mapper Module Registration")
        logging.info("Occlusion Mapper Module Started")
        # Log configuration parameters
        self._log_config()

    def _log_config(self) -> None:
        """Logs all paramters that can be set on construction."""
        config = {
            "manual_control_topic": self.manual_control_topic,
            "mapping_filepath": self.mapping_filepath,
            "camera_ip": self.camera_ip,
        }
        logging.info(f"Occlusion Mapper configuration:\n{json.dumps(config, indent=4)}")

    def _save_mapping_callback(self: Any) -> Tuple[str, int]:
        # Do something with the data
        data = request.get_json()
        logging.info(f"Save Mapping request: {data}")
        # Serializing json
        json_object = json.dumps(data, indent=4)

        # Writing to sample.json
        with open(self.mapping_filepath, "w") as outfile:
            outfile.write(json_object)
        return jsonify({"status": "success"})

    def _camera_callback(self: Any) -> Tuple[str, int]:
        azimuth = request.args.get("azimuth")
        elevation = request.args.get("elevation")
        zoom = request.args.get("zoom")
        logging.info(
            f"Camera Point request elevation: {elevation}, azimuth: {azimuth}, zoom: {zoom}"
        )
        if azimuth is None or elevation is None or zoom is None:
            return (
                jsonify({"error": "Pan, elevation, and zoom parameters required"}),
                400,
            )
        azimuth = float(azimuth)
        elevation = float(elevation)
        zoom = float(zoom)

        data = {"azimuth": azimuth, "elevation": elevation, "zoom": zoom}

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

        self.publish_to_topic(self.manual_control_topic, payload_json)
        # Do something with azimuth and elevation parameters
        return jsonify({"azimuth": azimuth, "elevation": elevation, "zoom": zoom})

    def main(self: Any) -> None:
        # main function wraps functionality and always includes a while True
        # (make sure to include a sleep)

        # include schedule heartbeat in every main()
        schedule.every(10).seconds.do(
            self.publish_heartbeat, payload="Occlusion Mapper Module Heartbeat"
        )

        frontend_thread = Thread(
            target=self.app.run,
            kwargs={"host": "0.0.0.0", "port": 5000, "debug": False},
        )
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
        mapping_filepath=str(os.environ.get("MAPPING_FILEPATH")),
        mqtt_ip=str(os.environ.get("MQTT_IP")),
        camera_ip=str(os.environ.get("CAMERA_IP")),
    )
    # call the main function
    template.main()
