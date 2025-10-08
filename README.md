# Sketch Key

Crimson Code 2025 Hackathon Project

## Prompt 

Art and Innovation

## Objective

The art is the images that users create and get cleaned up using AI
The innovation is using the images that are created as randomization tools to use in TLS communication. 
Additionally, the drawings based on the prompt can be a data point that is mined to improve the data used in the image generator or just to be sold (?). 
This is based on the idea of capcha to improve image recognition. But this is more creative fuel for AI to learn from.


### System Outline

- Given a random word, users draw a piece of art on a virtual canvas.
- The images that are created get enhanced using generative AI (who just wants to vote on stick figures). 
- After the user completes their artwork, they can submit it and choose between 2 pieces of art 
- Users compete daily, in a wordle style fashion, for the most creative piece of art

## Final Outcome

Our goals for this project were lofty, but our final product was at least mildly entertaining
to a few sleep deprived hackers, but perhaps not for the reason we intended.
We created a containerized full stack Django-React app that allowed users to create and submit drawings to be ranked. 
The algorithim used to rank images is the same algorithim used to rank chess players.

<img width="931" height="704" alt="drawing(45)" src="https://github.com/user-attachments/assets/92b05077-00b6-42fe-82e8-c637720fa157" />

# Tools Used
- React + React Router
  - Vite
  - TailwindCss
- Django
  - sqlite
  - Django-Rest
- Docker
  - Github CI/CD
