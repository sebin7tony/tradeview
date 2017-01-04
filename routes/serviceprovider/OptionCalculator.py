
from vollib import black_scholes
from vollib.black_scholes.implied_volatility import implied_volatility
from vollib.black_scholes.greeks import analytical 
from datetime import datetime
import sys, json;
from decimal import Decimal
import numpy

# Constants
INTEREST_RATE = 0.10


#
# Days between 2 dates
# d1 and d2 are date strings 
#
def days_between_in_years(current_date, expiry_date):
    d1 = datetime.strptime(current_date, "%Y-%m-%d")
    d2 = datetime.strptime(expiry_date, "%Y-%m-%d")
    return abs((d2 - d1).days) / (365.25)

#
# Option value = black_scholes(flag, S, K, t, r, sigma)
#
# flag(str) - flag (str) - 'c' or 'p' for call or put 
# S (float) - underlying asset price
# K (float) - strike price
# t (float) - time to expiration in years
# r (float) - risk-free interest rate
# sigma (float) - annualized standard deviation, or volatility
#
def calculateOptionPrice(type,spot_price,strike,current_date,expiry_date,volatility) :

	#Setting the flag variable 

	if type == "CE":
		flag = 'c'
	elif type == "PE":
		flag = 'p'

	S = spot_price
	K = strike

	#Calculate expiry in years
	t = days_between_in_years(current_date, expiry_date)
 
	r = INTEREST_RATE
	sigma = volatility

	# calculate option price
	optionPrice = black_scholes.black_scholes(flag, S, K, t, r, sigma)

	return optionPrice

#
# iv = implied_volatility(price, S, K, t, r, flag)
# 
# price (float) - the Black-Scholes option price
# S (float) - underlying asset price
# K (float) - strike price
# t (float) - time to expiration in years
# r (float) - risk-free interest rate
# flag (str) - 'c' or 'p' for call or put
#
def calculateImpliedVolatility(option_price,spot_price,strike,current_date,expiry_date,type):

	price = option_price
	S = spot_price
	K = strike

	#calculate expiry in years
	t = days_between_in_years(current_date, expiry_date)

	#print "days_between_in_years "+str(t)

	r = INTEREST_RATE

	#Setting the flag variable 

	if type == "CE":
		flag = 'c'
	elif type == "PE":
		flag = 'p'

	iv = implied_volatility(price, S, K, t, r, flag)

	return iv



#
# -------Calculate greeks values -------
# 
# Eg :- 
# delta value = delta(flag, S, K, t, r, sigma)
#
# flag (str) - 'c' or 'p' for call or put
# S (float) - underlying asset price
# K (float) - strike price
# t (float) - time to expiration in years
# r (float) - risk-free interest rate
# sigma (float) - annualized standard deviation, or volatility
#
def calculateGreeks(type,spot_price,strike,current_date,expiry_date,volatility) :

	#Setting the flag variable 

	if type == "CE":
		flag = 'c'
	elif type == "PE":
		flag = 'p'

	S = spot_price
	K = strike

	#Calculate expiry in years
	t = days_between_in_years(current_date, expiry_date)
 
	r = INTEREST_RATE
	sigma = round(volatility,4)

	#print "volatility "+str(volatility)

	# calculate option greeks
	optionGreek = {}

	#print "sigma "+str(sigma)
	
	try:
		optionGreek["delta"] = round(analytical.delta(flag, S, K, t, r, sigma),4)
		optionGreek["gamma"] = round(analytical.gamma(flag, S, K, t, r, sigma),4)
		optionGreek["rho"]  = round(analytical.rho(flag, S, K, t, r, sigma),4)
		optionGreek["theta"] = round(analytical.theta(flag, S, K, t, r, sigma),4)
		optionGreek["vega"] = round(analytical.vega(flag, S, K, t, r, sigma),4)
	except Exception as e:
		#print e;
		#print str(current_date) + " : "+ str(expiry_date) + " : volatility " +str(volatility)
		pass

	
	return optionGreek



# Executing the main method
# 
# Example input string in stdin
# {
#	"type" : "CE",
#	"spot_price" :248,
#	"strike" :265,
#	"current_date" : "2016-09-27",
#	"expiry_date" : "2016-09-29",
#	"current_option_price" : 0.04
# }
# 
# Keep the date format yyyy-mm-dd
#

if __name__ == "__main__":

	# reading the json from node as string 
	inputString = sys.stdin.readline()

	#print "INPUT recieved in python : "+inputString
	# Convert the string json to python dict
	# Returns a empty array back if there is a invalid json comes
	try:
		inputJson = json.loads(inputString);
	except Exception as e:
		print '{}';
		quit();


	# Checking all the keys are defined before calculating the greeks and iv
	# returns a empty array if any of the keys are undefined
	if 'current_option_price' not in inputJson or 'spot_price' not in inputJson or 'strike' not in inputJson or 'current_date' not in inputJson or 'expiry_date' not in inputJson or 'type' not in inputJson:
		print '{}';
		quit();


	iv = calculateImpliedVolatility(inputJson['current_option_price'],inputJson['spot_price'],
		inputJson['strike'],inputJson['current_date'],inputJson['expiry_date'],inputJson['type']);

	# Checking whether the implied volatility is in between 0 and 1
	# if it is not in the expected range then we cannot calculate the greeks 
	# as expected. So returning a empty json.
	if iv > 1 or iv < 0 :
		print '{}';
		quit();


	greeks = calculateGreeks(inputJson['type'],inputJson['spot_price'],inputJson['strike'],inputJson['current_date'],
		inputJson['expiry_date'],iv)

	#print the outputs as a string to the stdout 
	outputJson = '{ "iv" : '+json.dumps(round(iv,4))+',"greeks" : '+json.dumps(greeks)+'}'

	print outputJson

#
# That is the end of option calculator
#