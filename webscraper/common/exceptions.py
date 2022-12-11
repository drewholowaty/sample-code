class WebscraperResponseError(Exception):
    def __init__(
        self, request, response, message="Error receiving response from website"
    ):
        self.request = request
        self.response = response
        self.message = message
        super().__init__(self.message)

    def __str__(self):
        return f"{self.message}: {self.request} -> {self.response}"
